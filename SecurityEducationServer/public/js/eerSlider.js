$(function() {
    // initialize
    (function(){
        let eer = $('#sld-key-stroke-eer').val()
        eer /= 100
        $('#key-stroke-eer').text(eer)
        postEER(eer)
    }())

    // real-time
    $('#sld-key-stroke-eer').on('input', function() {
        let eer = $(this).val()
        eer /= 100
        $('#key-stroke-eer').text(eer)
    });
    
    // released
    $('#sld-key-stroke-eer').on('change', function() {
        let eer = $('#key-stroke-eer').text()
        postEER(eer)
    });


    function postEER(eer) {
        var url = 'http://localhost:8000/key-stroke-eer'
        $.ajax({
            url: url,
            type:'POST',
            data: {'eer':eer}
        })
    }
})