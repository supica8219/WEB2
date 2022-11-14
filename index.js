'use strict';

// ライブラリインポート
const express = require('express');
const http = require('http');
const path = require('path');
const sleep = require('./sleep');
const fs = require('fs');
const socketIO = require('socket.io');
const app = express();
const server = http.Server(app);
const io = socketIO(server);

const value_table = [
  [45,-11,4,-1,-1,4,-11,45],
  [-11,-16,-1,-3,-3,2,-16,-11],
  [4,-1,2,-1,-1,2,-1,4],
  [-1,-3,-1,0,0,-1,-3,-1],
  [-1,-3,-1,0,0,-1,-3,-1],
  [4,-1,2,-1,-1,2,-1,4],
  [-11,-16,-1,-3,-3,2,-16,-11],
  [45,-11,4,-1,-1,4,-11,45]
];

const room = class {
  constructor(room_name) { /* コンストラクタ */
    this.room_name = room_name;
    this.blackID = "";
    this.whiteID = "";
    this.turn = 1;
    this.alive = true;
    this.level = 1;
    this.users = [],
    this.mode = "",
    this.table = [
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,1,2,0,0,0],
      [0,0,0,2,1,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
    ];
  }
}
const user = class {
  constructor(id) { /* コンストラクタ */
    this.id = id;
    this.room = "";
    this.role = "";
    this.name = "";
    this.chara = "";
  }
}

//　ルーム・ユーザーリスト定義
var rooms = {}
var users = {}

//ルーム作成
rooms['room1'] = new room('room1');
rooms['room1'].mode = 'multi';

/*ソケットコネクション開始*/
io.on('connection', function(socket) {
  // ユーザー定義
  users[socket.id] = new user(socket.id);
  /*---------------------------------------------------- 
  
  ー－－－－－－－－－－オンライン対戦ー－－－－－－－－－－－－

 ---------------------------------------------------------*/
 // ルーム一覧返却
 socket.on("return_rooms",()=>{
   io.to(socket.id).emit("ret_rooms",rooms);
 })
 // ルーム作成
 socket.on("create_room",(create_name)=>{
  rooms[create_name] = new room(create_name);
  rooms[create_name].mode = 'multi';
  io.to(socket.id).emit("ret_create_rooms");
 })
  //CHECK CONNECTED2
  socket.on("join_multi_room",(room_name,room_mode,chara,name)=>{
    for(let key of socket.rooms){
      if(socket.id != key){
        socket.leave(key)
      }
    } 
    socket.join(room_name)
    users[socket.id].room = room_name;
    users[socket.id].chara = chara;
    users[socket.id].name = name;
    if( rooms[room_name] == undefined ){
      rooms[room_name] = new room(room_name);
      rooms[room_name].mode = room_mode;
    }
    if(users.hasOwnProperty(rooms[room_name].whiteID)){var white_user = users[rooms[room_name].whiteID].name;var white_chara = users[rooms[room_name].whiteID].chara;}else {var white_user = "-----";var white_chara = ""}
    if(users.hasOwnProperty(rooms[room_name].blackID)){var black_user = users[rooms[room_name].blackID].name;var black_chara = users[rooms[room_name].blackID].chara;}else {var black_user = "-----";var black_chara = ""}
    io.to(room_name).emit('ret_role',white_user,black_user,white_chara,black_chara);
    io.to(socket.id).emit('ret_table2',rooms[room_name].table,room_name,rooms[room_name].turn,2,2);
  });
  socket.on('admin2',(role)=>{
    var room_name = users[socket.id].room;if(room_name=="")return;
    if(role=="black"&& rooms[room_name].blackID == "" && rooms[room_name].whiteID != socket.id){
      rooms[room_name].blackID = socket.id;
      users[socket.id].role = "black";
      if(users.hasOwnProperty(rooms[room_name].whiteID)){
      var white_user = users[rooms[room_name].whiteID].name;
      var white_chara = users[rooms[room_name].whiteID].chara;
      }else{ 
      var white_user = ""
      var white_chara = ""
      }
      if(users.hasOwnProperty(rooms[room_name].blackID)){
      var black_user = users[rooms[room_name].blackID].name;
      var black_chara = users[rooms[room_name].blackID].chara;
      }else{ 
      var black_user = ""
      var black_chara = ""
      }
      console.log(black_chara+"1")
      io.to(room_name).emit('ret_role',white_user,black_user,white_chara,black_chara);
    }
    if(role=="white"&& rooms[room_name].whiteID == ""&& rooms[room_name].blackID != socket.id){
      rooms[room_name].whiteID = socket.id;
      users[socket.id].role = "white";
      if(users.hasOwnProperty(rooms[room_name].whiteID)){
      var white_user = users[rooms[room_name].whiteID].name;
      var white_chara = users[rooms[room_name].whiteID].chara;
      }else{ 
      var white_user = ""
      var white_chara = ""
      }
      if(users.hasOwnProperty(rooms[room_name].blackID)){
      var black_user = users[rooms[room_name].blackID].name;
      var black_chara = users[rooms[room_name].blackID].chara;
      }else{
      var black_user = ""
      var black_chara = ""
      }
      io.to(room_name).emit('ret_role',white_user,black_user,white_chara,black_chara);
    }
  });
  //SEND ACTION---------------------------------------------------------
  socket.on('clickedSquare2', function(row,column){
    var room_name = users[socket.id].room;
    var turn = rooms[room_name].turn;
    var role = users[socket.id].role;
    var table = rooms[room_name].table;
    if(!rooms.hasOwnProperty(room_name)){console.log("NOROOM");return;}
    //ROLE REFUSE
    if(role=="black"||role=="white"){}else{return;}
    if(role=="black"&&turn==2){return;}
    if(role=="white"&&turn==1){return;}
    
    if(canClickSpot(row,column,table,turn) == true){
      var affectedDiscs = getAffectedDiscs(row,column,table,turn);
      flipDiscs(affectedDiscs,table);
      table[row][column] = turn;
      if(!canMove(1,table) && !canMove(2,table)){
        io.to(room_name).emit('result',ret_count(table,2),ret_count(table,1))
        rooms[room_name].alive = false;
        console.log("ゲーム終了");
      }
      if(turn==1 && canMove(2,table)){
        rooms[room_name].turn=2;
      }
      if(turn==2 && canMove(1,table)){
        rooms[room_name].turn=1;
      }
      io.to(room_name).emit('ret_table2',table,room_name,rooms[room_name].turn,ret_count(table,2),ret_count(table,1));
    }
  });

  //EMOTION
  socket.on('send_emotion',(number)=>{
    
    var room_name = users[socket.id].room;
    var role = users[socket.id].role;
    console.log(number,room_name,role);
    if(role == "black"){
      io.to(rooms[room_name].whiteID).emit('emotion',number);
    }
    if(role == "white"){
      io.to(rooms[room_name].blackID).emit('emotion',number);
    }
  });
  //RESTAERT
  socket.on('new_game',()=>{
    var room_name = users[socket.id].room;
    io.to(room_name).emit('restart');
    sleep(1000).then( () => {
    rooms[room_name] = new room(room_name);
    rooms[room_name].mode = 'multi';
    console.log("---")
    io.to(room_name).emit('ret_table2',retCanMoveTable(rooms[room_name].turn,room_name),room_name,rooms[room_name].turn,{},2,2);
    });
  })
  /*ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
  
  ー－－－－－－－－－－CPU対戦ー－－－－－－－－－－－－

  ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー*/
  //JOIN ROOM
  socket.on("join_room", function(room_name,room_mode,level){  
    for(let key of socket.rooms){
      if(socket.id != key){
        socket.leave(key)
      }
    } 
    socket.join(room_name)
    users[socket.id].room = room_name;
    if( rooms[room_name] == undefined ){
      rooms[room_name] = new room(room_name);
      rooms[room_name].mode = room_mode;
      rooms[room_name].level = level;
      rooms[room_name].bot = true;
    }
    rooms[room_name].users.push(socket.id);
    var table = rooms[room_name].table
    io.to(room_name).emit('ret_table',table,room_name,rooms[room_name].turn,ret_count(table,2),ret_count(table,1));
  })
  socket.on('admin',(role)=>{
    var room_name = users[socket.id].room;
    if(role=="black"&& rooms[room_name].blackID == ""){
      rooms[room_name].blackID = socket.id;
      users[socket.id].role = "black";
      console.log("blackID:"+socket.id)
    }
    if(role=="white"&& rooms[room_name].whiteID == ""){
      rooms[room_name].whiteID = socket.id;
      users[socket.id].role = "white";
      console.log("whiteID:"+socket.id)
    }
    if(rooms[room_name].bot==true){
      if(users[socket.id].role=="white"){
        rooms[room_name].blackID="BOT";
        if(rooms[room_name].turn==1)botAction(room_name);
      }
      if(users[socket.id].role=="black"){rooms[room_name].whiteID="BOT";}
    }
    if(role=="view") users[socket.id].role = "view";
  })  
  //SEND ACTION---------------------------------------------------------
  socket.on('clickedSquare', function(row,column){
    var room_name = users[socket.id].room;
    var turn = rooms[room_name].turn;
    var role = users[socket.id].role;
    var table = rooms[room_name].table;
    if(!rooms.hasOwnProperty(room_name)){return;}
    //ROLE REFUSE
    if(role=="black"||role=="white"){}else{return;}
    if(role=="black"&&turn==2){return;}
    if(role=="white"&&turn==1){return;}

    if(canClickSpot(row,column,table,turn) == true){
      var affectedDiscs = getAffectedDiscs(row,column,table,turn);
      flipDiscs(affectedDiscs,table);
      table[row][column] = turn;
      if(!canMove(1,table) && !canMove(2,table)){
        io.to(room_name).emit('result',ret_count(table,2),ret_count(table,1))
        console.log("ゲーム終了");
      }
      if(turn==1 && canMove(2,table)){
        rooms[room_name].turn=2;
      }
      if(turn==2 && canMove(1,table)){
        rooms[room_name].turn=1;
      }
      io.to(room_name).emit('ret_table',table,room_name,rooms[room_name].turn,ret_count(table,2),ret_count(table,1));
      if(rooms[room_name].bot==true && !((rooms[room_name].turn==1&&role=="black")||(rooms[room_name].turn==2&&role=="white"))){
        botAction(room_name);
      }else{
        console.log(rooms[room_name].bot,rooms[room_name].turn,role)
      }
    }
  });

  //DISCONNECTED
  socket.on('disconnect', () => {
    if(users[socket.id].room!=""){
      var room_name=users[socket.id].room
      var role = users[socket.id].role; 
      if(rooms[room_name].blackID==socket.id)rooms[room_name].blackID="";
      if(rooms[room_name].whiteID==socket.id)rooms[room_name].whiteID="";
    }
    if(users[socket.id].room!=""){
      var room_name=users[socket.id].room
      console.log(room_name+"ccc")
    if(users.hasOwnProperty(rooms[room_name].whiteID)){var white_user = users[rooms[room_name].whiteID].name;}else {var white_user = "-----"}
    if(users.hasOwnProperty(rooms[room_name].blackID)){var black_user = users[rooms[room_name].blackID].name;}else {var black_user = "-----"}
      io.to(room_name).emit('ret_role',white_user,black_user)
    }
  });
});
//FUNCTIONS -------------------------------------------------------------
function canClickSpot(row,column,table,turn){
  if(table[row][column] != 0){
    return false;
  }
  var affectedDiscs = getAffectedDiscs(row,column,table,turn);
  if (affectedDiscs.length == 0) return false;
  else return true;
}

function getAffectedDiscs(row,column,table,turn){
  var affectedDiscs = [];
  for(var pi=0;pi<Math.PI*2;pi+=Math.PI/4){
    var dx=Math.round(Math.cos(pi));
    var dy=Math.round(Math.sin(pi));
    var couldBeAffected = [];
    var rowIterator = row;
    var columnIterator = column;
    rowIterator += dx;
    columnIterator += dy;
    while (rowIterator <= 7 && rowIterator >= 0 && columnIterator <= 7 && columnIterator >= 0){
      var valueAtSpot = table[rowIterator][columnIterator];
      if(valueAtSpot == 0 || valueAtSpot == turn){
        if(valueAtSpot == turn){
          affectedDiscs = affectedDiscs.concat(couldBeAffected);
        }
        break;
      }else{
        var discLocation = {row:rowIterator,column:columnIterator};
        couldBeAffected.push(discLocation);
      }
      rowIterator += dx;
      columnIterator += dy;
    }
  }
  return affectedDiscs;
}
function flipDiscs(affectedDiscs,table){
  for (var i = 0; i< affectedDiscs.length; i++){
    var spot = affectedDiscs[i];
    if (table[spot.row][spot.column] == 1){
      table[spot.row][spot.column] = 2;
    }else {
      table[spot.row][spot.column] = 1;
    }
  }
}

function canMove(turn,table){
  for(var i=0;i<8;i++){
    for(var j=0;j<8;j++){
      if(canClickSpot(i,j,table,turn)){
        return true;}
    }
  }
  return false;
}

function ret_cell(table,row,column,value,depth,turn){
  if(depth == 0){
    return [row,column,value];
  };
  //ひっくり返してターン変える
  var r_value = -999,r_row,r_column;
  var tmp_row,tmp_column,tmp_value;
  for(var i=0;i<8;i++)
  for(var j=0;j<8;j++)
  if(canClickSpot(i,j,table,turn) == true){
    var tmp_table = JSON.parse(JSON.stringify(table))
    var affectedDiscs = getAffectedDiscs(i,j,tmp_table,turn);flipDiscs(affectedDiscs,tmp_table);tmp_table[row][column]=turn;
    [tmp_row,tmp_column,tmp_value] = ret_cell(tmp_table,i,j,value_table[i][j],depth-1,turn==1?2:1)
    if(r_value<tmp_value){r_row = i;r_column=j;r_value=tmp_value;}
  }
  
  return [r_row,r_column,r_value];
}
// ハードモード
function botAction(room_name){
  //１秒まつ
  sleep(1000).then( () => {
    var turn = rooms[room_name].turn;
    var table = rooms[room_name].table;
    var level = rooms[room_name].level;
    var row = -999,column = -999,value;
    var level = rooms[room_name].level;
    [row,column,value]  = ret_cell(table,0,0,-999,level,turn)
    
    //無ければ返却
    if(row==-999){return;}
    console.log(row,column,"-----")
    var affectedDiscs = getAffectedDiscs(row,column,table,turn);
    flipDiscs(affectedDiscs,table);
    table[row][column] = turn;
    //終了判定
    if(!canMove(1,table) && !canMove(2,table)){
      io.to(room_name).emit('result',ret_count(table,4),ret_count(table,1))
    }
    if(turn==1 && canMove(2,table)){
      rooms[room_name].turn=2;
    }else if(turn==2 && canMove(1,table)){
      rooms[room_name].turn=1;
    }else{
      botAction3(room_name);
    }
    io.to(room_name).emit('ret_table',table,room_name,rooms[room_name].turn,ret_count(table,2),ret_count(table,1));
    return;
  })
}

function ret_count(table,turn){
  var count = 0;
  for(var i=0; i<8; i++){
    for(var j=0; j<8; j++){
      if(table[i][j] == turn){
        count++;
      }
    }
  }
  return count;
}

app.use('/static', express.static(__dirname + '/static'));
//RETURN HTML FILE
app.get('/zunko', (request, response) => {
  response.sendFile(path.join(__dirname, '/static/CPU/zunko.html'))
});
app.get('/itako', (request, response) => {
  response.sendFile(path.join(__dirname, '/static/CPU/itako.html'))
});
app.get('/kiritan', (request, response) => {
  response.sendFile(path.join(__dirname, '/static/CPU/kiritan.html'))
});
app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname, '/static/top.html'))
})
app.get('/cpu', (request, response) => {
    response.sendFile(path.join(__dirname, '/static/cpu.html'))
})
app.get('/robby',(request, response) => {
    response.sendFile(path.join(__dirname, '/static/vs_room/robby.html'))
})
app.get('/rooms',(request, response) => {
    response.sendFile(path.join(__dirname, '/static/vs_room/rooms.html'))
})
app.get('/vs_room',(request, response) => {
  response.sendFile(path.join(__dirname, '/static/vs_room/vs_room.html'))
})
//LISTEN SERVER PORT 3000
server.listen(4000, function() {
  console.log('Starting server on port 4000');
});

