$(function() {
    $('.value').each(function(index, element){
        let button = '<td><button class="btn-copy">値をコピーする</button></td>'
        $(element).parent().append(button)
    })

    $('.btn-copy').click(function(){
        let text = $(this).parent().prev().text()
        let textarea = $('<textarea></textarea>')
        textarea.text(text)
        $(this).append(textarea)
        textarea.select()
        document.execCommand('copy')
        textarea.remove()

        alert('コピー完了： ' + text)
    })
})
