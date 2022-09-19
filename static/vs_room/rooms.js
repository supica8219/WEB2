var socket = io();
console.log(getParam('chara'))
socket.emit('return_rooms');
//PRINT RETURN TABLE
socket.on('ret_rooms',(rooms) => {
    Object.keys(rooms).forEach(function(key) {
        var room = this[key];
        if(room.mode == "multi"){
        console.log(key, room);
        var a = document.createElement('a');
        var p = document.createElement('p');
        a.href = "/vs_room?chara=" + getParam('chara') + 
        "&name=" + getParam('name') + "&room=" + key;
        a.innerHTML = key;
        var rooms_area = document.getElementById('rooms');
        p.appendChild(a)
        rooms_area.appendChild(p)
        }
    }, rooms);
});
socket.on('ret_create_rooms',() => {
    console.log('a')
    location.reload();
});
function getParam(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
function create_room(){
    var create_name = document.getElementById('create_name').value;
    socket.emit('create_room',create_name);
}