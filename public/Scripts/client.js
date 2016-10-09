var app = angular.module('myApp', ['btford.socket-io'])
  .factory('socketio', ['$rootScope', function ($rootScope) {
    var socket = io.connect();
    var active = false;
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
}])

    .controller('ArduController', ['$scope', 'socketio', function ($scope,socketio) {
////////////LIGHTS
            var lights;

            $scope.lights = lights;
            
            $scope.lightstatusOn = function(light){
              light.status = "on";
              light.active = true;
              socketio.emit('led:on', light.name);
              socketio.emit('active:false', light.name);
              socketio.emit("lights.update", $scope.lights); 
            };
    
            $scope.lightstatusOff = function(light){
              light.status = "off";
              light.active = false;
              socketio.emit('led:off', light.name);
              socketio.emit("lights.update", $scope.lights);
            };
    

            socketio.on('light', function(data){
              $scope.lights = data;
                //console.log(data);
            })

            socketio.on('led:on', function(data){
                $scope.lights[data.value] = {                  
                  status: "on",
                  active: true

                };
                //console.log(data.value);

            });

            socketio.on('led:off', function(data){
                $scope.lights[data.value] = {
                  status: "off",
                  active: false
                };
            });
////////////BUTTONS
            var arrcompte;
            $scope.arrcompte = arrcompte;

            $scope.arrcompte = function(compteurs){
            socketio.emit("arrcompte.update", $scope.arrcompte);
            };

            socketio.on('compteurs', function (data) {
              console.table(data);
            });

    }]);
 