const crypto = require('crypto')
const speakeasy = require('speakeasy')
const qrcode = require('qrcode')
const utils = require('./utils')


var secret = ''
var authCode = ''
var token 
var authResult = ''

exports.showQRCode = function (req, res) 
{
    secret = speakeasy.generateSecret({name:'enPiT セキュリティエンジニアリング', length: 20})
    qrcode.toDataURL(secret.otpauth_url, (err, url) => {
        let results = {}
        if (err == null) {
            results['qrcodeDataURL'] = url
        }
        else {
            results['qrcodeDataURL'] = ''
        }
        res.send(results)    
    });
}

exports.login = function (req, res) 
{
    let requests = req.body
    authCode = requests['authCode']

    // 実際にtokenをサーバーでも作ってみる
    token = speakeasy.totp({
        secret: secret.base32,
        encoding: 'base32'
    });

    // 検証
    const verified = speakeasy.totp.verify({
        secret: secret.base32,
        encoding: 'base32',
        token: authCode,
        window: 6 // ここの文字列数大事，これが違うとfalseしか返ってこない
    });

    if(verified == true) {
        authResult = true
    } else {
        authResult = false
    }

    let results = {}
    results['authCode'] = authCode
    results['authResult'] = authResult

    exports.secret = secret.base32
    exports.trueCode = token
    exports.authCode = authCode
    exports.authResult = authResult

    let data = {
        'secret': secret.base32,
        'authCode': authCode,
        'trueCode': token,
        'authResult': authResult
    }
    utils.dumpData('totp.json', data)

    res.send(results)    
}