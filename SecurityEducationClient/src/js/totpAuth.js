$(function () {
    $('#btn-totp-show-qrcode').click(function () {
        var url = 'http://localhost:8000/totp-show-qrcode'
        $.ajax({
            url: url,
            type:'POST',
            data: {},
        })
        .done( (results) => {
            let qrcodeDataURL = results['qrcodeDataURL']
            if (qrcodeDataURL != '') {
                $('#img-qrcode').html('<img src="' + qrcodeDataURL + '">')
                $('#dsp-status').text('登録用画像取得済み')
            }
            else {
                $('#dsp-status').text('登録用画像取得失敗')
            }
        })
    })

    $('#btn-totp-auth-code-submit').click(function () {
        var url = 'http://localhost:8000/totp-login'
        let authCode = $('#ipt-totp-auth-code').val()

        $.ajax({
            url: url,
            type:'POST',
            data: {'authCode':authCode},
        })
        .done( (results) => {
            let authResult = results['authResult']
            if (authResult == true) {
                $('#dsp-status').text('認証成功')
            }
            else {
                $('#dsp-status').text('認証失敗')
            }
        })

        $('#ipt-totp-auth-code').val('')
    })

    
    $("#ipt-totp-auth-code").keydown(function(e){
      $('#dsp-status').text('')  
    })
})
