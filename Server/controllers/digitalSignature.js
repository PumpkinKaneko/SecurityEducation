const crypto = require('crypto')
const path = require('path')
const fs = require('fs')
const utils = require('./utils')

let data = ''
let signature = ''
let verifyResult = ''


exports.submit = function (req, res) {
    let requests = req.body
  
    // (7)：情報と署名を受け取る
    data = requests['data']
    signature = requests['signature']
  
    // 検証を行うインスタンスを作成する
    const verify = crypto.createVerify('RSA-SHA256');
  
    // (8)：検証用のインスタンスに情報を入力する
    verify.write(data);
    verify.end();
  
    // 公開鍵を読み込む
    let publicKeyPath = '../keys/public_key.pem'
    let publicKey = fs.readFileSync(path.join(__dirname, publicKeyPath), 'utf8');
  
    // (9) (10)：公開鍵で署名を複合し，ハッシュ値が一致するか確認する
    verifyResult = verify.verify(publicKey, signature, 'base64')
  

    exports.data = data
    exports.signature = signature
    exports.verifyResult = verifyResult

    // dump
    let results = {
        'data':data,
        'signature':signature,
        'verifyResult': verifyResult
    }
    utils.dumpData('digsig.json', results)
    res.send(results)
}