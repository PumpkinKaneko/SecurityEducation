const crypto = require('crypto')
const utils = require('./utils')

var signupUsername = ''
var signupPassword = ''
var signupPasswordHashValue = ''
var loginUsername = ''
var loginPassword = ''
var loginPasswordHashValue = ''
var authResult = ''


// 登録
exports.signup = function (req, res) 
{
    let requests = req.body
    signupUsername = requests['username']
    signupPassword = requests['password']

    // パスワードのハッシュ値を計算する
    signupPasswordHashValue = crypto.createHash('sha256').update(signupPassword, 'utf8').digest('hex')

    exports.signupUsername = signupUsername
    exports.signupPassword = signupPassword
    exports.signupPasswordHashValue = signupPasswordHashValue

    res.send('successed!')
}


// 認証
exports.login = function (req, res) 
{
    let requests = req.body
    loginUsername = requests['username']
    loginPassword = requests['password']

    // パスワードのハッシュ値を計算する
    loginPasswordHashValue = crypto.createHash('sha256').update(loginPassword, 'utf8').digest('hex')

    let results = {}
    if (loginUsername === signupUsername) // IDは一致していますか？
    {
        if (loginPasswordHashValue === signupPasswordHashValue) // パスワードのハッシュ値は一致していますか？
        {
            results['authResult'] = true
            authResult = true
        }
        else {
            results['authResult'] = false
            authResult = false
        }
    }
    else {
        results['authResult'] = false
        authResult = false
    }


    exports.loginUsername = loginUsername
    exports.loginPassword = loginPassword
    exports.loginPasswordHashValue = loginPasswordHashValue
    exports.authResult = authResult

    // dump data
    var data = {
        "signupUsername":signupUsername,
        "signupPassword":signupPassword,
        "signupPasswordHashValue":signupPasswordHashValue,
        "loginUsername": loginUsername,
        "loginPassword": loginPassword,
        "loginPasswordHashValue": loginPasswordHashValue,
        "authResult": authResult
    }
    utils.dumpData('form.json', data)

    res.send(results)
}