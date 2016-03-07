(function() {
  "use strict";

  angular.module("app").controller("editCtrl", function($scope) {

// ----------------- FORMS -------------------------------

    $scope.sendForm = function(data) {
      $.ajax({
        method: "PATCH",
        url: "/footprints/1",
        data: data,
        dataType: "JSON"
      });
    };


    $scope.changePage = function(page, direction) {
      if (direction === 1) {
        var newPage = page - 1;
      } else if (direction === 2) {
        var newPage = page + 1;
      };

      var pageStr = 'a[href="#' + (newPage) + '"]';
      $(pageStr).tab('show') ;
    };



    $scope.vehicleOptions = [
      {
        name: "Gasoline",
        factor: 8.887
      }, {
        name: "Diesel",
        factor: 10.18
      }];

    $scope.publicOptions = [
      {
        name: "Bus",
        factor: 300
      }, {
        name: "Commuter rail",
        factor: 165
      }, {
        name: "Transit Rail",
        factor: 160
      }, {
        name: "Amtrak",
        factor: 191
      }];

    $scope.submitTravel = function(mileage, carMiles, fuelType, miles, publicType, direction) {
      var formData = [
        {
          type: "vehicle",
          fuel_type: fuelType.factor,
          miles: carMiles,
          mileage: mileage
        }, {
          type: "public_transportation",
          miles: miles,
          mode: publicType.factor
        }];

      for (var i = 0; i < formData.length; i++) {
        $scope.sendForm(formData[i]);
      };

      $scope.changePage(2, direction);

    };

    $scope.submitAir = function(airMiles, direction) {
      var formData = {
        type: "air_travel",
        miles: airMiles
      };
      $scope.sendForm(formData);
      $scope.changePage(3, direction)
    }

    $scope.electricityOptions = [
      {
        name: "kWh/year",
        factor: 1
      },{
        name: "$/year",
        factor: 0.1015
    }];

    $scope.naturalOptions = [
      {
        name: "Therms/year",
        factor: 1
      }, {
        name: "$/year",
        factor: 0.0950
      }, {
        name: "Cu.Ft/year",
        factor: 8.9
    }];


    $scope.submitEnergy = function(electricityInput, electricityType, naturalInput, naturalType, direction) {

      var formData = [
        {
          type: "electricity",
          input: electricityInput,
          input_type: electricityType.factor
        }, {
          type: "natural_gas",
          input: naturalInput,
          input_type: naturalType.factor
        }];

      for (var i = 0; i < formData.length; i++) {
        $scope.sendForm(formData[i]);
      };

      $scope.changePage(4, direction);

    };

    $scope.heatingOptions = [
      {
        name: "gal/year",
        factor: 1
      }, {
        name: "$/year",
        factor: 4.02
    }];

    $scope.propaneOptions = [
      {
        name: "gal/year",
        factor: 1
      }, {
        name: "$/year",
        factor: 4.00 // literally made up this value
    }];

    $scope.submitHeat = function(heatingInput, heatingType, propaneInput, propaneType, direction ) {
      var formData = [
        {
          type: "heating",
          input: heatingInput,
          input_type: heatingType.factor
        }, {
          type: "propane",
          input: propaneInput,
          input_type: propaneType.factor
      }];

      for (var i = 0; i < formData.length; i++) {
        $scope.sendForm(formData[i]);
      };

      $scope.changePage(5, direction);

    };

    
    $scope.submitForm = function(form, page, direction) {

      var formName = '#' + form + '';
      console.log(formName);
      var formData = $(formName).serializeArray();
      console.log(formData);

      $scope.sendForm(formData);
      $scope.changePage(page, direction);
    };



    $scope.submitFood = function(meatValue, dairyValue, grainsValue, fruitValue, otherValue, direction) {

      $scope.foodData = [];
      
      var formData = [
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
      
      for (var i = 0; i < formData.length; i++) {
        $scope.sendForm(formData[i]);
      };

      $scope.changePage(7, direction);
    };

// --------------- CHARTS -----------------------------

    var pieData = gon.habits;
    var travel = (pieData["vehicle"] + pieData["public_transportation"] +pieData["air_travel"]);
    var housing = (pieData["home"] + pieData["electricity"] + pieData["natural_gas"] + pieData["heating"] + pieData["propane"]);
    var food = (pieData["meat"] + pieData["dairy"] + pieData["grains"] + pieData["fruit"] + pieData["other"]);

    // var colors = Highcharts.getOptions().colors,
    var colors = ["#2b908f", "#4d4dff", "#91e8e1"],

        categories = ['Travel', 'Housing', 'Food'],
        data = [{
            y: travel,
            color: colors[0],
            drilldown: {
                name: 'Travel',
                categories: ['Vehicle', 'Public transportation', 'Air travel'],
                data: [pieData["vehicle"], pieData["public_transportation"], pieData["air_travel"]],
                color: colors[0]
            }
        }, {
            y: housing,
            color: colors[1],
            drilldown: {
                name: 'Housing',
                categories: ['Sqft', 'Electricity', 'Natural gas', 'Heating oil', 'Propane'],
                data: [pieData["home"], pieData["electricity"], pieData["natural_gas"], pieData["heating"], pieData["propane"]],
                color: colors[1]
            }
        }, {
            y: food,
            color: colors[2],
            drilldown: {
                name: 'Food',
                categories: ['Meat', 'Dairy', 'Grains', 'Fruit', 'Other'],
                data: [pieData["meat"], pieData["dairy"], pieData["grains"], pieData["fruit"], pieData["other"]],
                color: colors[2]
            }
        }],

        totalData = [], // ??
        subData = [], // ??
        i,
        j,
        dataLen = data.length,
        drillDataLen,
        brightness;


    // Build the data arrays
    for (i = 0; i < dataLen; i += 1) {

        // add browser data
        totalData.push({
            name: categories[i],
            y: data[i].y,
            color: data[i].color
        });

        // add version data
        drillDataLen = data[i].drilldown.data.length;
        for (j = 0; j < drillDataLen; j += 1) {
            brightness = 0.2 - (j / drillDataLen) / 5;
            subData.push({
                name: data[i].drilldown.categories[j],
                y: data[i].drilldown.data[j],
                color: Highcharts.Color(data[i].color).brighten(brightness).get()
            });
        }
    }

    // Create the chart
    $('#pieChartContainer').highcharts({
        chart: {
            type: 'pie'
        },
        title: {
            style: {
                fontSize: '24px'
            },
            text: 'Your carbon footprint'
        },
        subtitle: {
            text: 'Some subtitle text',
            style: {
                fontSize: '15px'
            },
        },
        yAxis: {
            title: {
                text: 'MT CO2/year'
            }
        },
        plotOptions: {
            pie: {
                shadow: false,
                center: ['50%', '50%']
            }
        },
        tooltip: {
            valueSuffix: ' MT CO2'
        },

        series: [{
            name: 'Total',
            data: totalData,
            size: '60%',
            dataLabels: {
                formatter: function () {
                    return this.y > 5 ? this.point.name : null;
                },
                color: '#ffffff',
                distance: -30,
                style :{
                    fontSize: '15px'
                }
            }
        }, {
            name: 'Sub',
            data: subData,
            size: '80%',
            innerSize: '60%',
            dataLabels: {
                formatter: function () {
                    // display only if larger than 1
                    return this.y > 1 ? '<b>' + this.point.name + ':</b> ' + this.y + '%' : null;
                },
                style: {
                    fontSize: '12px'
                }
            }
        }]
    });



// -------------------- BAR CHART --------------------------
// ---------------------------------------------------------


    

    var profile_names = gon.names;
    var travel_data = gon.travel;
    var housing_data = gon.housing;
    var food_data = gon.food; 


    $('#barChartContainer').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: 'User footprints'
        },
        xAxis: {
            categories: profile_names
        },
        yAxis: {
            min: 0,
            title: {
                text: 'MT CO2/year'
            },
            stackLabels: {
                enabled: true,
                style: {
                    fontWeight: 'bold',
                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                }
            }
        },
        legend: {
            align: 'right',
            x: -30,
            verticalAlign: 'top',
            y: 25,
            floating: true,
            backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
            borderColor: '#CCC',
            borderWidth: 1,
            shadow: false
        },
        tooltip: {
            headerFormat: '<b>{point.x}</b><br/>',
            pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
        },
        plotOptions: {
            column: {
                stacking: 'normal',
                dataLabels: {
                    enabled: true,
                    color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                    style: {
                        textShadow: '0 0 3px black'
                    }
                }
            }
        },
        series: [{
            name: 'Travel',
            data: travel_data,
            color: colors[0]
        }, {
            name: 'Housing',
            data: housing_data,
            color: colors[1]
        }, {
            name: 'Food',
            data: food_data,
            color: colors[2]
        }]
    });



// ------------------- ONCLICK FUNCTIONS -------------------
// ---------------------------------------------------------


    var pieChart = $('#pieChartContainer').highcharts();
    var barChart = $('#barChartContainer').highcharts();
    var newTravel = travel_data[0];
    var totalFootprint = food_data[0] + housing_data[0] + travel_data[0];

    // var x = document.getElementById("vehicleFunction")
    // x.onclick = function checkCar() {
    //     if (x.checked) {
    //         pieChart.series[1].data[0].update(pieData["vehicle"] - gon.saved_gas);
    //         pieChart.series[0].data[0].update(travel - gon.saved_gas);
            
    //         barChart.series[0].data[0].update(travel_data[0] - gon.saved_gas);
    //         document.getElementById("updated-footprint").innerHTML = (totalFootprint - gon.saved_gas).toFixed(2); 


    //     } else if (!x.checked) {
    //         pieChart.series[1].data[0].update(pieData["vehicle"]);
    //         pieChart.series[0].data[0].update(travel);
            
    //         barChart.series[0].data[0].update(newTravel);
    //         document.getElementById("updated-footprint").innerHTML = totalFootprint.toFixed(2);
    //     }
        
    // };
  
  


  });
}());