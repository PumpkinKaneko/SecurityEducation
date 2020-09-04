$(function () {
    let path = require('path')
    let fs = require('fs')
    let crypto = require('crypto')
    let utils = require('../js/utils')

    let signupAuthResult = false
    let signupChallenge = ''
    let signupSignature = ''
    let loginAuthResult = false
    let loginChallenge = ''
    let loginSignature = ''


    // 登録
    $('#btn-fido-signup-username-submit').click(function()
    {
        signupAuthResult = false

        signupUsername = $('#ipt-fido-signup-username').val()

        // 
        let url = 'http://localhost:8000/fido-signup-username'
        let data = {"signupUsername":signupUsername}
        $.ajax({
            url:url,
            type:'POST',
            data: data,
        })
        .done((results) => {
            if (results['authResult'] == true) {
                $('#dsp-status').text('チャレンジ取得成功')
                signupChallenge = results['signupChallenge']
                $('#dsp-challenge').text(signupChallenge)        
            } 
            else {
                $('#dsp-status').text('チャレンジ取得失敗')
                signupChallenge = ''
            }
        })
        .fail((results) => {
            $('#dsp-status').text('登録失敗：サーバーエラー')
        })
        .always((results)=>{
            $('#ipt-fido-signup-username').val('')
        })
    })

    // キーストローク認証
    let singupKeyStrokeTimestamps = []
    $("#ipt-fido-signup-key-stroke").keydown(function(e){
        if (e.key != 'Enter' && e.key != 'Tab' && e.key != 'Backspace') {
            singupKeyStrokeTimestamps.push(e.timeStamp)
        }
        $('#dsp-status').text('生体認証中')            
    });

    $('#btn-fido-signup-key-stroke-reset').click(function() {
        $('#ipt-fido-signup-key-stroke').val('')
        $('#dsp-status').text('入力情報リセット')            
        singupKeyStrokeTimestamps = []
    })

    $('#btn-fido-signup-sign').click(function()
    {
        signupAuthResult = false
        let keystrokeData = utils.loadData('keystroke.json')
        let signupVector = keystrokeData['signupVector']
        let eer = keystrokeData['eer'] 
        let vector = utils.getKeyStrokeVector(singupKeyStrokeTimestamps)
        let match = utils.getCosineSimilarity(vector, signupVector)
        if (match != null) 
        {
            if (match >= eer) {
                let data = 'Match:' + match + ' ≥ EER:' + eer
                $('#dsp-status').text('署名成功: ' + data)
                signupAuthResult = true
            }
            else {
                let data = 'Match:' + match + ' ≤ EER:' + eer
                $('#dsp-status').text('署名失敗: ' + data)
                signupAuthResult = false
            }    
        }
        else {
            let data = '登録文字数：' + (signupVector.length+1) + ', EER: ' + eer + ', Match: ' + match
            $('#dsp-status').text('署名失敗: 文字数が一致しません, ' + data)
        }
        singupKeyStrokeTimestamps = []
        $('#ipt-fido-signup-key-stroke').val('')
    })
    
    $('#btn-fido-signup-response-submit').click(function(){
        if (signupChallenge != '' && signupAuthResult == true) {
            // 秘密鍵のパス
            let privateKeyPath = '../keys/private_key.pem'

            // 秘密鍵を読み込む
            let privateKey = fs.readFileSync(path.join(__dirname, privateKeyPath), 'utf8')

            // 署名を行うインスタンスを作成する
            let sign = crypto.createSign('RSA-SHA256')
            
            // ④：署名用のインスタンスに情報を入力する
            let response = signupChallenge
            sign.update(response)
            sign.end()
            
            // ⑤：秘密鍵で署名を行う． 
            signupSignature = sign.sign(privateKey, 'base64')
            //$('#dsp-signature').text(signupSignature)

            // 公開鍵のパス
            let publicKeyPath = '../keys/public_key.pem'

            // 公開鍵を読み込む
            publicKey = fs.readFileSync(path.join(__dirname, publicKeyPath), 'utf8')

            let url = 'http://localhost:8000/fido-signup-response'
            let data = {
                "signupResponse":response, 
                "signupSignature":signupSignature, 
                "publicKey":publicKey
            }
            $.ajax({
                url:url,
                type:'POST',
                data: data,
            })
            .done((data) => {
                if (data['authResult'] == true) {
                    $('#dsp-status').text('登録成功')
                }
                else {
                    $('#dsp-status').text('登録失敗：署名無効')
                }
            })
            .fail((data) => {
                $('#dsp-status').text('レスポンス送信失敗')
            })
            .always((data)=>{
                $('#ipt-fido-signup-response').val('')
            })
        }
        else {
            $('#dsp-status').text('登録失敗')
        }
        signupAuthResult = false
        signupChallenge = ''
    })


    $('#btn-fido-login-username-submit').click(function()
    {
        loginAuthResult = false

        loginUsername = $('#ipt-fido-login-username').val()

        // 
        let url = 'http://localhost:8000/fido-login-username'
        let data = {"loginUsername":loginUsername}
        $.ajax({
            url:url,
            type:'POST',
            data: data,
        })
        .done((results) => {
            if (results['authResult'] == true) {
                $('#dsp-status').text('チャレンジ取得成功')
                loginChallenge = results['loginChallenge']
                $('#dsp-challenge').text(loginChallenge)        
            } 
            else {
                $('#dsp-status').text('チャレンジ取得失敗')
                loginChallenge = ''
            }
        })
        .fail((results) => {
            $('#dsp-status').text('登録失敗：サーバーエラー')
        })
        .always((results)=>{
            $('#ipt-fido-login-username').val('')
        })
    })

    // キーストローク認証
    let loginKeyStrokeTimestamps = []
    $("#ipt-fido-login-key-stroke").keydown(function(e){
        if (e.key != 'Enter' && e.key != 'Tab' && e.key != 'Backspace') {
            loginKeyStrokeTimestamps.push(e.timeStamp)
        }
        $('#dsp-status').text('生体認証中')            
    });

    $('#btn-fido-login-key-stroke-reset').click(function() {
        $('#ipt-fido-login-key-stroke').val('')
        $('#dsp-status').text('入力情報リセット')            
        loginKeyStrokeTimestamps = []
    })

    $('#btn-fido-login-sign').click(function()
    {
        loginAuthResult = false
        let keystrokeData = utils.loadData('keystroke.json')
        let signupVector = keystrokeData['signupVector']
        let eer = keystrokeData['eer'] 
        let vector = utils.getKeyStrokeVector(loginKeyStrokeTimestamps)
        let match = utils.getCosineSimilarity(vector, signupVector)
        if (match != null) 
        {
            if (match >= eer) {
                let data = 'Match:' + match + ' ≥ EER:' + eer
                $('#dsp-status').text('署名成功: ' + data)
                loginAuthResult = true
            }
            else {
                let data = 'Match:' + match + ' ≤ EER:' + eer
                $('#dsp-status').text('署名失敗: ' + data)
                loginAuthResult = false
            }    
        }
        else {
            let data = '登録文字数：' + (signupVector.length+1) + ', EER: ' + eer + ', Match: ' + match
            $('#dsp-status').text('署名失敗: 文字数が一致しません, ' + data)
        }
        loginKeyStrokeTimestamps = []
        $('#ipt-fido-login-key-stroke').val('')
    })
    
    $('#btn-fido-login-response-submit').click(function(){
        if (loginChallenge != '' && loginAuthResult == true) {
            // 秘密鍵のパス
            let privateKeyPath = '../keys/private_key.pem'

            // 秘密鍵を読み込む
            let privateKey = fs.readFileSync(path.join(__dirname, privateKeyPath), 'utf8')

            // 署名を行うインスタンスを作成する
            let sign = crypto.createSign('RSA-SHA256')
            
            // ④：署名用のインスタンスに情報を入力する
            let response = loginChallenge
            sign.update(response)
            sign.end()
            
            // ⑤：秘密鍵で署名を行う． 
            loginSignature = sign.sign(privateKey, 'base64')

            let url = 'http://localhost:8000/fido-login-response'
            let data = {
                "loginResponse":response, 
                "loginSignature":loginSignature, 
            }
            $.ajax({
                url:url,
                type:'POST',
                data: data,
            })
            .done((data) => {
                if (data['authResult'] == true) {
                    $('#dsp-status').text('認証成功')
                }
                else {
                    $('#dsp-status').text('認証失敗：署名無効')
                }
            })
            .fail((data) => {
                $('#dsp-status').text('レスポンス送信失敗')
            })
            .always((data)=>{
                $('#ipt-fido-login-response').val('')
            })
        }
        else {
            $('#dsp-status').text('認証失敗')
        }
        loginAuthResult = false
        loginChallenge = ''
    })
})
