(function() {
  "use strict";

  angular.module("app").controller("indexCtrl", function($scope, $http) {
    
    $scope.check = function() {
      $scope.header = true;
    }

    $(window).load(function(){
       $scope.header = true;
    })


    $scope.indexInit = function() {
      $scope.header = false; 
    }

    

        window.scope=$scope;


 });
}());