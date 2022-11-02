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
const sound = new Howl({
  src: ['/static/image/PC-Keyboard01-Enter2.mp3']
});
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
  drawGreenSquares();
  join_room();
}
function clickedSquare(row,column){
  socket.emit('clickedSquare',row,column);
}
function drawGreenSquares(){
  blackBackground.innerHTML=""
  for(var row = 0; row < 8; row++){
    var tr = document.createElement('tr')
    for (var column = 0; column < 8; column++){
      var greenSquare = document.createElement("td");
      greenSquare.classList.add('GreenSquare');
      greenSquare.style.backgroundColor = "green";
      greenSquare.setAttribute("onclick","clickedSquare("+row+","+column+")");
      tr.appendChild(greenSquare);
    }
    blackBackground.appendChild(tr);
  }
}
function drawDiscs(){
  discLayer.innerHTML="";
  var bcount=0,wcount=0;
  for(var row = 0; row <8; row++){
    var tr = document.createElement('tr');
    for(var column = 0; column < 8;column++){
      var value = discs[row][column];
      var disc = document.createElement("td");
      disc.classList.add("disc")
      if (value == 0){
        disc.setAttribute("onclick","clickedSquare("+row+","+column+")");
      }else{
        disc.style.borderRadius = "50%";
        disc.setAttribute("onclick","clickedSquare("+row+","+column+")");
        if (value == 1){
          disc.style.backgroundImage = "radial-gradient(#333333 30%, black 70%)";   
          disc.style.opacity = 1.0
        }
        if(value == 2){
          disc.style.backgroundImage = "radial-gradient(white 30%,#cccccc 70%)";
          disc.style.opacity = 1.0         
        }
        if(value==1){bcount++;}else{wcount++;}
      }
      tr.appendChild(disc);
    }
    discLayer.appendChild(tr);
  } 
}
//PRINT RETURN TABLE
socket.on('ret_table',(table,room_name,turn,white_num,black_num) => {
  sound.play();
  document.getElementById('bp2').innerHTML = black_num;
  document.getElementById('wp2').innerHTML = white_num;
  discs=table
  drawDiscs()
});

socket.on('connect',()=>{
  gameStart();
});
socket.on('result',(white_point,black_point)=>{
  var result = document.getElementById('result')
  result.style.display = "block"
  document.getElementById('bp').innerHTML = black_point;
  document.getElementById('wp').innerHTML = white_point;
  if(black_point > white_point){
    document.getElementById("winlose").innerHTML = "WIN!"
    document.getElementById("winlose").style.color = "yellow"
  }else if(black_point == white_point){
    document.getElementById("winlose").innerHTML = "DROW"
    document.getElementById("winlose").style.color = "green"
  }else{
    document.getElementById("winlose").innerHTML = "LOSE"
    document.getElementById("winlose").style.color = "blue"
  }
})
