const crypto = require('crypto')
const utils = require('./utils')

var signupUsername = ''
var signupPassword = ''
var challenge = ''
var response = ''
var hashValue = ''
var authResult = ''


// 登録：IDとPasswordの登録
exports.signup = function (req, res) 
{
    // ②：クライアントから送られてきたIDとパスワードをデータベースに保存する．
    let requests = req.body
    signupUsername = requests['username']
    signupPassword = requests['password']

    exports.username = signupUsername
    exports.password = signupPassword

    exports.challenge = ''
    exports.response = ''
    exports.hashValue = ''

    res.send(signupUsername)
}


// 認証：ID送信
exports.loginWithUsername = function (req, res) 
{
    // (4): サーバーは，IDを受け取り，登録されている利用者か確認する．
    let requests = req.body
    let loginUsername = requests['username']
    
    let result = {}

    // (5): 登録されている利用者だった場合，ランダムな文字列を作成する．
    if (loginUsername == signupUsername) {
        result['auth'] = true

        challenge = generateChallenge(16)
        result['challenge'] = challenge
        exports.challenge = challenge
    }
    else {
        result['auth'] = false
    }
    // (6): サーバーは，⑤で作成したランダムな文字列をクライアントに送信する（チャレンジ）
    res.send(result)
}


// 認証：パスワード送信
exports.loginWithResponse = function (req, res) 
{
    // (10): サーバーは，クライアントから送られてきたハッシュ値を受け取る．
    let requests = req.body
    response = requests['response']
    exports.response = response


    // (11): サーバーは，登録されていたパスワードとチャレンジとして送ったランダムな文字列を組み合わせて，
    // ハッシュ値を計算する
    hashValue = crypto.createHash('sha256').update(signupPassword, 'utf8').digest('hex')
    exports.hashValue = hashValue
    
    let result = {}

    // (12): クライアントから受け取った(10)のハッシュ値と
    // サーバー側で作成した(11)のハッシュ値が一致しているかどうかを確認する．
    // 一致していた場合，認証は成功する．
    if (response == hashValue) {
        result['auth'] = true
    }
    else {
        result['auth'] = false
    }
    authResult = result['auth']
    exports.authResult = authResult

    // dump
    let data = {
        "username" : signupUsername,
        "password" : signupPassword,
        "challenge" : challenge,
        "response" : response,
        "hashValue" : hashValue,
        "authResult" : authResult
    }
    utils.dumpData('candr.json', data)

    res.send(result)
}

function generateChallenge (length) {
    const S="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    const N=length
    challenge = Array.from(crypto.randomFillSync(new Uint8Array(N))).map((n)=>S[n%S.length]).join('')
    return challenge
}
exports.generateChallenge = generateChallenge;