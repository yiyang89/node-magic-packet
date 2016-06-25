'use strict';

/* Controllers */



angular.module('rwolApp', [])
    .controller('rwolApp-controller', function($scope, $http) {
      // $scope.userlist = [['Unit Name', 'Unit IP', 'Unit Mac']];
      $scope.userlist = [];
      $scope.registerInfo = function() {
        // Read data and send to server
        var data = "{\"username\" : \"" + $scope.nameInput + "\","+
                      "\"ip\" : \"" + $scope.ipInput + "\"," +
                      "\"mac\" : \"" + $scope.macInput + "\"" + "}";
        var saveData = data;
        // Post to server
        $http.post('/api/register', data).success(function(data, status) {
          // On success add user details to the current list.
          console.log("Successfully registered");
          $scope.userlist.push(data);
          console.log($scope.userlist);
        });
      }
      $scope.wakeComputer = function(name, ip, mac) {
        var data = "{\"username\" : \"" + name + "\","+
                      "\"ip\" : \"" + ip + "\"," +
                      "\"mac\" : \"" + mac + "\"" + "}";
        $http.post('/api/wakeComputer', data).success(function(data, status) {
          $scope.wakeResponse = "Successfully submitted wake response";
        });
      }
      $scope.removeComputer = function(name, ip, mac) {
        var data = "{\"username\" : \"" + name + "\","+
                      "\"ip\" : \"" + ip + "\"," +
                      "\"mac\" : \"" + mac + "\"" + "}";
        $http.post('/api/removeComputer', data).success(function(data, status) {
          $scope.userlist = data;
        });
      }
      $scope.retrieveComputers = function() {
        $http.get('/api/retrieveComputers').success(function(data, status) {
          if (data.length == 0) {
            $scope.retrievalResponse = "Server currently has no registered computers";
          } else {
            $scope.userlist = data;
          }
        })
      }
      // Dining room desktop ip and mac address
      // {"username":"dining room desktop","ip":"192.168.0.135","mac":"00:19:B9:43:69:0B"}

      });
