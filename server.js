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
var buttonData;
// lights model 
var lights = [          
            {id:'1', name:"Led1", status:"off", active:false},
            {id:'2', name:"Led2", status:"off", active:false},
            {id:'3', name:"Led3", status:"off", active:false},
            {id:'4', name:"Led4", status:"off", active:false}
            ];

// var buttons = [          
//             {id:'1', name:"Button1", status:"off", active:false},
//             {id:'2', name:"Button2", status:"off", active:false},
//             {id:'3', name:"Button3", status:"off", active:false},
//             {id:'4', name:"Button4", status:"off", active:false}
//             ];


var DEBUG = true; //Debugage -> console node + navigateur web


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

    // // Attached to an analog pin
    // Button1 = new five.Button("A3");
    // Button2 = new five.Button("A2");
    // Button3 = new five.Button("A1");
    // Button4 = new five.Button("A0");

    buttons = new five.Buttons({
    pins: ["A3", "A2", "A1", "A0"],
    });

    buttons.on("press", function(button) {
        console.log("Pressed: ", button.pin);
    });

    buttons.on("release", function(button) {
        console.log("Released: ", button.pin);
    });

    // Button1.on("down", function() {
    // console.log( "Button1 Préssé" );
    // });
    // Button1.on("up", function() {
    // console.log( "Button1 Laché" );
    // });
    // Button2.on("down", function() {
    // console.log( "Button2 Préssé" );
    // });
    // Button2.on("up", function() {
    // console.log( "Button2 Laché" );
    // });
    // Button3.on("down", function() {
    // console.log( "Button3 Préssé" );
    // });
    // Button3.on("up", function() {
    // console.log( "Button3 Laché" );
    // });
    // Button4.on("down", function() {
    // console.log( "Button4 Préssé" );
    // });
    // Button4.on("up", function() {
    // console.log( "Button4 Laché" );
    // });

});



//Socket connection handler
io.on('connection', function (socket) {  
        console.log('Nouveau Client connecté ID: ' + socket.id);

        io.sockets.emit('light', lights); //broadcast lights model
      

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