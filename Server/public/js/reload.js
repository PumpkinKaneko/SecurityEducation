$(function() {
    setInterval(function() {
        var url = 'http://localhost:8000/info'
        $.ajax({
            url: url,
            type:'GET',
        })
        .done((data) => {
            $('#form-signup-username').text(data['formSignupUsername'])
            $('#form-signup-password').text(data['formSignupPassword'])
            $('#form-signup-password-hash-value').text(data['formSignupPasswordHashValue'])
            $('#form-login-username').text(data['formLoginUsername'])
            $('#form-login-password').text(data['formLoginPassword'])
            $('#form-login-password-hash-value').text(data['formLoginPasswordHashValue'])
            $('#form-auth-result').text(data['formAuthResult'])

            $('#candr-signup-username').text(data['candrSignupUsername'])
            $('#candr-signup-password').text(data['candrSignupPassword'])
            $('#candr-challenge').text(data['candrChallenge'])
            $('#candr-response').text(data['candrResponse'])
            $('#candr-hash-value').text(data['candrHashValue'])
            $('#candr-auth-result').text(data['candrAuthResult'])

            $('#totp-secret').text(data['totpSecret'])
            $('#totp-auth-code').text(data['totpAuthCode'])
            $('#totp-true-code').text(data['totpTrueCode'])
            $('#totp-auth-result').text(data['totpAuthResult'])

            $('#key-stroke-signup-vector').text(data['keyStrokeSignupVector'])
            $('#key-stroke-login-vector').text(data['keyStrokeLoginVector'])
            $('#key-stroke-match').text(data['keyStrokeMatch'])
            //$('#key-stroke-eer').text(data['keyStrokeEER'])
            $('#key-stroke-auth-result').text(data['keyStrokeAuthResult'])

            $('#digsig-data').text(data['digsigData'])
            $('#digsig-signature').text(data['digsigSignature'])
            $('#digsig-verify-result').text(data['digsigVerifyResult'])

            $('#fido-signup-username').text(data['fidoSignupUsername'])
            $('#fido-signup-challenge').text(data['fidoSignupChallenge'])
            $('#fido-signup-signature').text(data['fidoSignupSignature'])
            $('#fido-login-username').text(data['fidoLoginUsername'])
            $('#fido-login-challenge').text(data['fidoLoginChallenge'])
            $('#fido-login-signature').text(data['fidoLoginSignature'])
            $('#fido-public-key').text(data['fidoPublicKey'])
            $('#fido-auth-result').text(data['fidoAuthResult'])
        })
        .fail( (data) => {
        })
        .always( (data) => {
    
        })
    }, 1000)

})
