$(function () {
    let crypto = require('crypto')
    let utils = require('../js/utils')

    let username = ''
    let password = ''
    let challenge = ''
    let response = ''

    $('#ipt-candr-login-username').hide()
    $('#ipt-candr-login-password').hide()

    // 登録：IDとPasswordの登録
    $('#btn-candr-signup-submit').click(function()
    {
        username = $('#ipt-candr-signup-username').val()
        password = $('#ipt-candr-signup-password').val()
        
        // (1): クライアントは，アカウントを登録するために，IDとパスワードを送信する．
        let url = 'http://localhost:8000/candr-signup'
        let data = {"username":username, "password":password}
        $.ajax({
            url:url,
            type:'POST',
            data: data,
        })
        .done( (result) => {
            $('#dsp-status').text('登録成功')
            $('#ipt-candr-login-username').show()
            $('#ipt-candr-login-password').hide()
                })
        .fail( (result) => {
            $('#dsp-status').text('登録失敗')
        })
        
        $('#ipt-candr-signup-username').val('')
        $('#ipt-candr-signup-password').val('')
        $('#dsp-challenge').text('')
        $('#dsp-response').text('')
    })


    // 認証：ID送信
    $('#btn-candr-username-submit').click(function()
    {
        username = $('#ipt-candr-login-username').val()

        // (3): クライアントは，認証のために，IDを送信する．
        let url = 'http://localhost:8000/candr-login-username'
        let data = {"username":username}
        $.ajax({
            url:url,
            type:'POST',
            data: data,
        })
        .done( (result) => {
            if (result['auth'] == true) {
                // (7): クライアントは，ランダムな文字列を受け取る．
                challenge = result['challenge']
                $('#dsp-status').text('チャレンジ取得成功')
                $('#dsp-challenge').text(challenge)
                $('#ipt-candr-login-username').val('')
                $('#ipt-candr-login-username').hide()
                $('#ipt-candr-login-password').show()
            }
            else {
                $('#dsp-status').text('登録されていないIDです')
            }
        })
        .fail((result) => {
            $('#dsp-status').text('チャレンジ取得失敗')
            $('#dsp-challenge').text('')
        })
        .always ((result) => {
            $('#ipt-candr-login-username').val('')
            $('#dsp-response').text('')
        })
        
    })


    // 認証：レスポンス送信
    $('#btn-candr-passowrd-submit').click(function()
    {
        // (8): パスワードとランダムな文字列を組み合わせて，ハッシュ値を計算する．
        password = $('#ipt-candr-login-password').val()
        response = crypto.createHash('sha256').update(password, 'utf8').digest('hex')
        $('#dsp-response').text(response)

        // (9): クライアントは，作成したハッシュ値をサーバーに送る（レスポンス）．
        // このハッシュ値は，盗聴されたとしても問題ない．
        let url = 'http://localhost:8000/candr-login-response'
        let data = {"response":response}
        $.ajax({
            url:url,
            type:'POST',
            data: data,
        })
        .done((result) => {
            if (result['auth'] == true) {
                $('#dsp-status').text('認証成功')
            }
            else {
                $('#dsp-status').text('認証失敗')
                $('#ipt-candr-login-username').val('')
                $('#ipt-candr-login-username').show()
            }
        })
        .fail( (result) => {
            $('#dsp-status').text('レスポンス送信失敗')
        })
        .always ((result) => {
            $('#ipt-candr-login-password').val('')
            $('#ipt-candr-login-password').hide()
            /*
            // dump
            let data = {
                "username": username,
                "password": password,
                "challenge": challenge,
                "response": response
            }
            utils.dumpData('candr.json', data)
            */
        })  
    })
})
