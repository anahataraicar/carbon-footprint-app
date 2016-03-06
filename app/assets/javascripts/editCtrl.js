(function() {
  "use strict";

  angular.module("app").controller("editCtrl", function($scope) {

    $scope.vehicleOptions = [
      {
        name: "Gasoline",
        factor: 8.887
      }, {
        name: "Diesel",
        factor: 10.18
      }];

    $scope.updateCar = function(type, form) {

      var formName = '#' + form + '';
      var formData = $(formName).serializeArray();
      console.log(formName);
      console.log(type.factor);
    };

    $scope.submitForm = function(page, direction, form, e) {

      var formName = '#' + form + '';
      var formData = $(formName).serializeArray();
      console.log(formData);

      $.ajax({
        method: "PATCH",
        url: "/footprints/1",
        data: formData,
        dataType: "JSON"
      });

      if (direction === 1) {
        var newPage = page - 1;
      } else if (direction === 2) {
        var newPage = page + 1;
      };

      var pageStr = 'a[href="#' + (newPage) + '"]';
      $(pageStr).tab('show') ;
    };



    $scope.submitFood = function(meatValue, dairyValue, grainsValue, fruitValue, otherValue) {

      $scope.foodData = [];
      
      var data = [
        {
          type: "meat",
          factor: meatValue
        }, {
          type: "dairy",
          factor: dairyValue
        },{
          type: "grains",
          factor: grainsValue
        }, {
          type: "fruit",
          factor: fruitValue
        }, {
          type: "other",
          factor: "otherValue"
        }];
      
      for (var i = 0; i < data.length; i++) {
        $.ajax({
          method: "PATCH",
          url: "/footprints/1",
          data: data[i],
          dataType: "JSON"
        });
      };

    };

  });
}());