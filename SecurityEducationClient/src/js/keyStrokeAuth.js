$(function() {
    let utils = require('../js/utils')

    let singupKeyStrokeTimestamps = []
    let loginKeyStrokeTimestamps = []


    $("#ipt-signup").keydown(function(e){
        if (e.key != 'Enter' && e.key != 'Tab' && e.key != 'Backspace') {
            singupKeyStrokeTimestamps.push(e.timeStamp)
        }
        $('#dsp-status').text('登録情報入力中')            
    });


    $("#ipt-login").keydown(function(e){
        if (e.key != 'Enter' && e.key != 'Tab' && e.key != 'Backspace') {
            loginKeyStrokeTimestamps.push(e.timeStamp)
        }
        $('#dsp-status').text('ログイン情報入力中')            
    });


    $("#btn-signup-submit").click(function(){
        let url = 'http://localhost:8000/key-stroke-signup'
        let keyStrokeVector = utils.getKeyStrokeVector(singupKeyStrokeTimestamps);

        let data = {"signup-vector": keyStrokeVector}
        $.ajax({
            url:url,
            type:'POST',
            data: data,
        })
        .done((results) => {
            let authResult = results['auth']
            if (authResult == true) {
                $('#dsp-status').text('生体情報の登録成功')
            }
            else {
                $('#dsp-status').text('生体情報の登録失敗')
            }
        })
        .fail((data) => {
            $('#dsp-status').text('登録失敗：サーバーエラー')
        })

        // clear 
        $('#ipt-signup').val('')
        singupKeyStrokeTimestamps = []
    });
    

    $("#btn-login-submit").click(function(){
        let url = 'http://localhost:8000/key-stroke-login'
        let keyStrokeVector = utils.getKeyStrokeVector(loginKeyStrokeTimestamps);

        let data = {"login-vector": keyStrokeVector}
        $.ajax({
            url: url,
            type:'POST',
            data: data,
        })
        .done((results) => {
            let authResult = results['authResult']
            let match = results['match']
            let eer = results['eer']
            if (authResult == true) {
                let data = 'Match:' + match + ' ≥ EER:' + eer
                $('#dsp-status').text('認証成功: ' + data)
            }
            else {
                let data = 'Match:' + match + ' ≥ EER:' + eer
                $('#dsp-status').text('認証失敗: ' + data)
            }
            // dump
            utils.dumpData('keystroke.json', results)
        })
        .fail((results) => {
            $('#dsp-status').text('認証失敗：サーバーエラー')
        })

        // clear
        $('#ipt-login').val('')
        loginKeyStrokeTimestamps = []
    });


    $("#btn-signup-reset").click(function(){
        $('#ipt-signup').val('')
        $('#dsp-status').text('登録情報リセット')            
        singupKeyStrokeTimestamps = []
    });


    $("#btn-login-reset").click(function(){
        $('#ipt-login').val('')
        $('#dsp-status').text('認証情報リセット')            
        loginKeyStrokeTimestamps = []
    });
})
