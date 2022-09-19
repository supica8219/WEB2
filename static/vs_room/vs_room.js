
//DIFINATION
var socket = io();
var socketID = "";
var blackBackground;
var gap = screen.width/100/4;
var cellWidth = screen.width/100*6-gap;
var discLayer;
var canMoveLayer;
var scoreLavel;
var gameover =false;
var turn;
var discs;
var myrole = "";
var table = document.getElementById("table")
var room_name = getParam('room');
var chara = getParam('chara');
var user_name = getParam('name');
var room_mode = "multi";
var charaURL = ["/static/Hiyori/Hiyori.model3.json","/static/Rice/Rice.model3.json"]
document.getElementById('rooms').href =  
"/rooms?chara=" + getParam('chara') + 
"&name=" + getParam('name');

blackBackground = document.getElementById("blackBackground");
discLayer = document.getElementById("discLayer");
canMoveLayer = document.getElementById("canMoveLayer");
scoreLavel = document.getElementById("scoreLavel");
blackBackground.style.width = cellWidth*8+ (gap*9)+"px";
blackBackground.style.height = cellWidth*8+ (gap*9)+"px";
drawGreenSquares();
socket.emit('join_room2',room_name,room_mode,chara,user_name);

function admin(role){
    myrole = role;
    socket.emit('admin2',role);
}
function clickedSquare2(row,column){
  console.log(row,column)
  socket.emit('clickedSquare2',row,column);
}
function drawGreenSquares(){
  for(var row = 0; row < 8; row++){
    for (var column = 0; column < 8; column++){
      var greenSquare = document.createElement("div");
      greenSquare.style.position = "absolute";
      greenSquare.style.width = cellWidth+"px";
      greenSquare.style.height = cellWidth+"px";
      greenSquare.style.backgroundColor = "green";
      greenSquare.style.left = (cellWidth+gap)*column+gap+"px";
      greenSquare.style.top =(cellWidth+gap)*row+gap+"px";
      greenSquare.setAttribute("onclick","clickedSquare2("+row+","+column+")");
      blackBackground.appendChild(greenSquare);
    }
  }
}
function drawDiscs(affectedDiscs){
  discLayer.innerHTML="";
  var bcount=0,wcount=0;
  for(var row = 0; row <8; row++){
    for(var column = 0; column < 8;column++){
      var value = discs[row][column];
      if (value == 0){
        
      }else{
        var disc = document.createElement("div");
        disc.style.position = "absolute";
        disc.style.width = cellWidth-4+"px";
        disc.style.height = cellWidth-4+"px";
        disc.style.borderRadius = "50%";
        disc.style.left = (cellWidth+gap)*column+gap+2+"px";
        disc.style.top = (cellWidth+gap)*row+gap+2+"px";
        for (var i = 0; i< affectedDiscs.length; i++){
         if(affectedDiscs[i].row==row && affectedDiscs[i].column==column){
            disc.classList.remove('disc_effect')
            disc.classList.add('disc_effect')
         }
        }
        disc.setAttribute("onclick","clickedSquare2("+row+","+column+")");
        if (value == 1){
          disc.style.backgroundImage = "radial-gradient(#333333 30%, black 70%)";   
          disc.style.opacity = 1.0
        }
        if(value == 2){
          disc.style.backgroundImage = "radial-gradient(white 30%,#cccccc 70%)";
          disc.style.opacity = 1.0         
        }
        if(value == 11){
          disc.style.backgroundColor = "rgba(255,255,255,0.3)";
          disc.style.borderRadius ="0px";
        }
        if(value == 22){
            disc.style.backgroundColor = "rgba(255,255,255,0.3)";
            disc.style.borderRadius ="0px";
        } 
        if(value == 100){
            disc.style.backgroundImage = "radial-gradient(#333333 29.9%, black 70%)";
            disc.style.border = "1px solid #000022";
        }
        if(value == 200){
            disc.style.backgroundImage = "radial-gradient(white 29.9%,#cccccc 70%)";
            disc.style.border = "1.5px solid #6a5acd";
        }
        discLayer.appendChild(disc);
        if(value==1){bcount++;}else{wcount++;}
      }
    }
  } 
}
//PRINT RETURN TABLE
socket.on('ret_table2',(table,room_name,turn,affectedDiscs,white_num,black_num) => {
  document.getElementById('bp2').innerHTML = black_num;
  document.getElementById('wp2').innerHTML = white_num;
  discs=table
  console.log(table)
  console.log(room_name)
  drawDiscs(affectedDiscs)
  
});
socket.on('ret_role',(white,black,white_chara,black_chara)=>{
    document.getElementById('role').innerHTML = "黒:" + black + black_chara + "<br>" + "白:" +white + white_chara;
    if(white_chara!="" && black_chara!=""){
      if(myrole == "black"){
        if(white_chara == "ライス")
        dododo(charaURL[1]);
        else if(white_chara == "ひより")
        dododo(charaURL[0])
      }
      if(myrole == "white"){
        if(black_chara == "ライス")
        dododo(charaURL[1]);
        else if(black_chara == "ひより")
        dododo(charaURL[0])
      }
    }
})
socket.on('emotion',(number)=>{
  console.log('return'+number);
  app.stage.children[1].internalModel.motionManager.startMotion('TapBody',number,2)
})
socket.on('result',(white_point,black_point)=>{
  var result = document.getElementById('result')
  result.style.display = "block"
  document.getElementById('bp').innerHTML = black_point;
  document.getElementById('wp').innerHTML = white_point;
  if(bp > wp){
    document.getElementById("winlose").innerHTML = "WIN!"
    document.getElementById("winlose").style.Color = "yellow"
  }else{
    document.getElementById("winlose").innerHTML = "LOSE"
    document.getElementById("winlose").style.Color = "blue"
  }
})
function send_emotion(number){
  console.log("send"+number);
  socket.emit('send_emotion',number);
}
function getParam(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}