
function SetURL(){
    var chara = document.form;
    console.log(chara)
    for (let i = 0; i< chara.length; i++) {
        if (chara[i].checked) {
            var character = chara[i].value;
        }
    }
    var next = document.getElementById("next");
    var text = document.getElementById("name").value;
    next.href = "/rooms?chara="+character+"&name="+text;
    console.log(next.href);
}
window.onload = function(){
    var checkOption = document.querySelectorAll("input");
    console.log(checkOption)
    checkOption.forEach(function(e) {
        e.addEventListener("change", function() {           
            SetURL();
        });
    });
}