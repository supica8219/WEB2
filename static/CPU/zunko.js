'use strict';

//DIFINATION
var socket = io();
var socketID = "";
var blackBackground;
var gap = screen.width/100/4;
var cellWidth = screen.width/100*6-gap;
var discLayer;
var canMoveLayer;
var scoreLavel;
var pictures = []
var gameover =false;
var turn;
var discs;
var table = document.getElementById("table")
//JOIN_ROOM_FORM
function join_room(){
  var role = "black";
  var room_name = "room"+Math.random()*100;
  var bot_flag = true;
  socket.emit('join_room',room_name,bot_flag);
  socket.emit('admin',role)
}
function gameStart(){
  blackBackground = document.getElementById("blackBackground");
  discLayer = document.getElementById("discLayer");
  canMoveLayer = document.getElementById("canMoveLayer");
  scoreLavel = document.getElementById("scoreLavel");
  blackBackground.style.width = cellWidth*8+ (gap*9)+"px";
  blackBackground.style.height = cellWidth*8+ (gap*9)+"px";
  drawGreenSquares();
  join_room();
}
function clickedSquare(row,column){
  socket.emit('clickedSquare',row,column);
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
      greenSquare.setAttribute("onclick","clickedSquare("+row+","+column+")");
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
        disc.setAttribute("onclick","clickedSquare("+row+","+column+")");
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
        } 
        if(value == 100){
            disc.style.backgroundImage = "radial-gradient(#333333 29.9%, black 70%)";
            disc.style.border = "2px solid #000022";
        }
        if(value == 200){
            disc.style.backgroundImage = "radial-gradient(white 29.9%,#cccccc 70%)";
            disc.style.border = "2px solid #aaaaff";
        }
        discLayer.appendChild(disc);
        if(value==1){bcount++;}else{wcount++;}
      }
    }
  } 
}
//PRINT RETURN TABLE
socket.on('ret_table',(table,room_name,turn,affectedDiscs) => {
  console.log(affectedDiscs)
  discs=table
  console.log(table)
  console.log(room_name)
  drawDiscs(affectedDiscs)
});

socket.on('connect',()=>{
  gameStart();
});
socket.on('result',()=>{
  var result = document.getElementById('result')
  result.style.display = "block"
})
window.onload = function() {
  const spinner = document.getElementById('loader1');
  spinner.src="/static/image/aida3.png";
  spinner.classList.add("loaded1");
}