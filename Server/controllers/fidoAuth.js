const crypto = require('crypto')
const candr = require('./candrAuth')
const utils = require('./utils')

var signupUsername = ''
var signupChallenge = ''
var signupSignature = ''
var loginUsername = ''
var loginChallenge = ''
var loginSignature = ''
var publicKey = ''
var authResult = false


// 登録：IDの登録とチャレンジの送信
exports.signupWithUsername = function (req, res) 
{
    //
    let requests = req.body
    signupUsername = requests['signupUsername']
    exports.signupUsername = signupUsername

    // 
    signupChallenge = candr.generateChallenge(16)
    exports.signupChallenge = signupChallenge

    let results = {}
    results['authResult'] = true
    results['signupChallenge'] = signupChallenge
    res.send(results)
}

exports.signupWithResponse = function (req, res) 
{
    let requests = req.body

    //
    let response = requests['signupResponse']

    //
    signupSignature = requests['signupSignature']
    exports.signupSignature = signupSignature

    //
    publicKey = requests['publicKey']
    exports.publicKey = publicKey
    //console.log(publicKey)
    //utils.dumpData('publicKey.pem', publicKey)


    // 検証を行うインスタンスを作成する
    const verify = crypto.createVerify('RSA-SHA256');

    // 
    verify.write(response);
    verify.end();

    // 
    let result = verify.verify(publicKey, signupSignature, 'base64')

    let data = {}
    if (result == true) {
        data['authResult'] = true
    }
    else {
        data['authResult'] = false
    }

    res.send(data)
}


// 認証：ID送信
exports.loginWithUsername = function (req, res) 
{
    // ④：サーバーは，IDを受け取り，登録されている利用者か確認する．
    let requests = req.body
    loginUsername = requests['loginUsername']
    
    let results = {}
    if (loginUsername == signupUsername) {
        results['authResult'] = true
        loginChallenge = candr.generateChallenge(16)
        results['loginChallenge'] = loginChallenge
        exports.loginChallenge = loginChallenge    
    }
    else {
        results['authResult'] = false
    }
    res.send(results)
}


exports.loginWithResponse = function (req, res) 
{
    let requests = req.body
    let response = requests['loginResponse']
    
    loginSignature = requests['loginSignature']
    exports.loginSignature = loginSignature

    // 検証を行うインスタンスを作成する
    const verify = crypto.createVerify('RSA-SHA256');

    // 
    verify.write(response);
    verify.end();

    // 
    let verifyResult = verify.verify(publicKey, loginSignature, 'base64')

    let results = {}
    if (verifyResult == true) {
        results['authResult'] = true
        authResult = true
    }
    else {
        results['authResult'] = false
        authResult = false
    }
    exports.authResult = authResult

    // dump
    let data = {
        "signupUsername": signupUsername,
        "signupChallenge": signupChallenge,
        "signupSignature": signupSignature,
        "loginUsername": loginUsername,
        "loginChallenge": loginChallenge,
        "loginSignature": loginSignature,
        "publicKey": publicKey,
        "authResult": authResult
    }
    utils.dumpData('fido.json', data)

    res.send(results)
}
