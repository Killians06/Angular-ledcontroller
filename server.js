var express        = require('express');  
var app            = express();  
var httpServer = require("http").createServer(app);  
var five = require("johnny-five");  
var io=require('socket.io')(httpServer);
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({extended: false});
var port = 9000; 
var led1,led2,led3,led4;
var ledData;
// lights model 
var lights = [          
            {id:'1', name:"Led1", status:"off", active:false},
            {id:'2', name:"Led2", status:"off", active:false},
            {id:'3', name:"Led3", status:"off", active:false},
            {id:'4', name:"Led4", status:"off", active:false}
            ];


var DEBUG = false; //Debugage -> console node + navigateur web


app.use(express.static(__dirname + '/public'));
app.use('/styles', express.static('styles'));
 
app.get('/', function(req, res) {  
        res.sendFile(__dirname + '/public/index.html');        
});

app.get('/lights', function(req,res){
    'use strict';
    res.send(lights);
});

httpServer.listen(port);  
console.log('Serveur Disponible à http://localhost:' + port);  

//Arduino board connection
 
var board = new five.Board();  
board.on("ready", function() {  
    console.log('Arduino connecté');
    Led1 = new five.Led(13);
    Led2 = new five.Led(12);
    Led3 = new five.Led(11);
    Led4 = new five.Led(10);
});

//Socket connection handler
io.on('connection', function (socket) {  
        console.log('Nouveau Client connecté ID: ' + socket.id);

        io.sockets.emit('light', lights); //broadcast lights model
      
            //console.log("fichier lights envoyé\n");
            //console.log(lights);

        socket.on('lights.update', function(data){
          lights = data;
          io.sockets.emit('light', lights); //broadcast lights model
            //console.log(data);
        })
      
        socket.on('led:on', function (data) {
          ledData = data;
          //lights = {$set:{'lights.$.name':ledData,'lights.$.status':'on'}};
            switch(ledData){
              case 'Led1':
                Led1.on();
                DEBUG && console.log(ledData);
                break;
              case 'Led2':
                Led2.on();
                DEBUG && console.log(ledData);
                break;
                case 'Led3':
                Led3.on();
                DEBUG && console.log(ledData);
                break;
              case 'Led4':
                Led4.on();
                DEBUG && console.log(ledData);
                break;
            }                   
        console.log('Instruction ' + data + ' ON reçue');
        io.sockets.emit('led:on', {value: ledData});
        });
 
        socket.on('led:off', function (data) {
          ledData = data;
            switch(ledData){
              case 'Led1':
                Led1.off();
                DEBUG && console.log(ledData);
                break;
              case 'Led2':
                Led2.off();
                DEBUG && console.log(ledData);
                break;
                case 'Led3':
                Led3.off();
                DEBUG && console.log(ledData);
                break;
              case 'Led4':
                Led4.off();
                DEBUG && console.log(ledData);
                break;
            }
        console.log('Instruction ' + data + ' OFF reçue');
        io.sockets.emit('led:off', {value: ledData});
        });
});
console.log('En attente de la connection avec Arduino');