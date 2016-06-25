'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('rwolApp.services', []).
  value('version', '0.1');

angular.module('infoService', []).service('SharedService', function ($rootScope) {

  var sharedService = new SharedService();

  function SharedService() {
          this.latlngs = [];
          this.resSelection = '';
          this.impark = [];
          this.easypark = [];
          this.disability = [];
          this.motorcycle = [];
          this.meter = [];
          this.parkingLots = [];
  }

  sharedService.pushLatLng = function(coord) {
    this.latlngs.push(coord);
  }

  sharedService.broadcastLatlng = function() {
    $rootScope.$broadcast('pointsUpdated');
  }

  sharedService.setResSelection = function(business) {
    this.resSelection = business;
  }

  sharedService.getResSelection = function() {
    return this.resSelection;
  }

  sharedService.broadcastResSelection = function() {
    $rootScope.$broadcast('resSelectionUpdated');
  }

  sharedService.broadcastHideUnselected = function() {
    $rootScope.$broadcast('hideUnselected');
  }

  sharedService.broadcastClearPrevious = function() {
    $rootScope.$broadcast('clearPrevious');
  }

  sharedService.clearList = function() {
    this.latlngs = [];
  }

  sharedService.getLatLngs = function() {
    console.log(this.latlngs);
    return this.latlngs;
  };

  sharedService.broadcastParkingUpdate = function(){
    console.log("Broadcasting Parking Update");
    $rootScope.$broadcast('showParking');
  }

  sharedService.setImpark = function(imparkArray) {
    this.impark = imparkArray;
  };

  sharedService.setEasypark = function(easyparkArray) {
    this.easypark = easyparkArray;
  };

  sharedService.setDisability = function(disabilityArray) {
    this.disability = disabilityArray;
  }

  sharedService.setMotorcycle = function(motorcycleArray) {
    this.motorcycle = motorcycleArray;
  }

  sharedService.setMeter = function(meterArray) {
    this.meter = meterArray;
  }

  return sharedService;

});
