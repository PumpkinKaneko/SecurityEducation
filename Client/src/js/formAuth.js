$(function () { 
    let utils = require('../js/utils')

    let signupUsername = ''
    let signupPassword = ''
    let loginUsername = ''
    let loginPassword = ''

    $('#btn-form-signup-submit').click(function(){
        signupUsername = $('#ipt-form-signup-username').val()
        signupPassword = $('#ipt-form-signup-password').val()

        var url = 'http://localhost:8000/form-signup'
        $.ajax({
            url:url,
            type:'POST',
            data: {"username":signupUsername, "password":signupPassword},
        })
        .done((data) => {
            $('#dsp-status').text('登録成功')
        })
        .fail((data) => {
            $('#dsp-status').text('登録失敗')
        })

        // clear
        $('#ipt-form-signup-username').val('')
        $('#ipt-form-signup-password').val('')
    })


    $('#btn-form-login-submit').click(function(){
        loginUsername = $('#ipt-form-login-username').val()
        loginPassword = $('#ipt-form-login-password').val()

        var url = 'http://localhost:8000/form-login'
        $.ajax({
            url:url,
            type:'POST',
            data: {"username":loginUsername, "password":loginPassword},
        })
        .done((results) => {
            let authResult = results['authResult']
            if (authResult == true) {
                $('#dsp-status').text('認証成功')
            }
            else {
                $('#dsp-status').text('認証失敗')
            }
        })
        .fail((results) => {
            $('#dsp-status').text('認証失敗：サーバーエラー')
        })

        // clear
        $('#ipt-form-login-username').val('')
        $('#ipt-form-login-password').val('')

        // dump
        /*
        let data = {
            "signupUsername": signupUsername,
            "signupPassword": signupPassword,
            "loginUsername": loginUsername,
            "loginPassword": loginPassword
        }
        utils.dumpData('form.json', data)
        */
    })
})
