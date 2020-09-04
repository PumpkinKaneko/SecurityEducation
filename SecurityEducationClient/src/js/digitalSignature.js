$(function () {
    let path = require('path')
    let fs = require('fs')
    let crypto = require('crypto')
    
    let data = ''

    $('#btn-digital-signature-sign').click(function()
    {
        // 送信する情報
        data = $('#ipt-digital-signature-data').val()

        // 秘密鍵のパス
        let privateKeyPath = '../keys/private_key.pem'

        // 署名を行うインスタンスを作成する
        let sign = crypto.createSign('RSA-SHA256');
        
        // (4)：署名用のインスタンスに情報を入力する
        sign.update(data);
        sign.end();

        // 秘密鍵を読み込む
        let privateKey = fs.readFileSync(path.join(__dirname, privateKeyPath), 'utf8');
        
        // (5)：秘密鍵で署名を行う． 
        signature = sign.sign(privateKey, 'base64');
        
        $('#dsp-status').text('署名付き情報作成済み')
        $('#ipt-digital-signature-data').val('')
    })


    $('#btn-digital-signature-submit').click(function()
    {
        var url = 'http://localhost:8000/digital-signature-submit'
        $.ajax({
            url: url,
            type:'POST',
            data: {"data":data, "signature":signature},
        })
        .done( (results) => {
            if (results['verifyResult'] == true) {
                $('#dsp-status').text('署名付き情報の検証成功')
            }
            else {
                $('#dsp-status').text('署名付き情報の検証失敗')
            }
        })
        .fail( (data) => {
            $('#dsp-status').text('検証失敗：サーバーエラー')
        })
        .always( (data) => {
    
        })

        $('#dsp-status').text('署名付き情報送信済み')
    })
})
