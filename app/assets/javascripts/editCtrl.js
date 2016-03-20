(function() {
  "use strict";

  angular.module("app").controller("editCtrl", function($scope, $http, $timeout, $location, $anchorScroll) {

    var userId = gon.user_id;

    $scope.setUpCharts = function() {
      $http.get('/api/v1/footprints/:id.json').then(function(response) {
          var pieData = response.data;
          $scope.drawPieChart(pieData);
          $scope.drawGauge();
          $scope.drawSmallPieChart(pieData);
      });
    };


    $scope.init = function() {
        $scope.setUpCharts();
        $scope.anchorPage();
        $scope.content = "pie";
        $scope.resultsVisible = false;
        $scope.modalVisible = true;
        $scope.totalSaved = 0;
        $scope.previousComplete = true;
        // $scope.userName = "new user";

        $scope.introInstructions = false;
       
        $scope.pills = [
            { name: "intro", visible: true },
            { name: "vehicle", visible: true },
            { name: "air", visible: true },
            { name: "electricity", visible: true },
            { name: "heat", visible: true },
            { name: "home", visible: true },
            { name: "food", visible: true },
            { name: "review", visible: true }
        ];

    };

    $scope.anchorPage = function() {
       var point = document.getElementById("point");
        $('html, body').stop().animate({
            scrollTop: $(point).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    };






// ---------- SUBMIT FOOTPRINT ---------------------- 

    $scope.submitProfile = function() {
        $http.get('/api/v1/footprints.json').then(function(response) {
            var barData = response.data;
            $scope.drawBarChart(barData);
            $scope.drawBubbleChart(barData);

        });

        $http.get('/api/v1/footprints/:id.json').then(function(response) {
            var pieData = response.data;

            
            $scope.calculateShow(pieData);
            $scope.barChartExist = true;
           

            var userValue = pieData["total"];
            var average = pieData["average"];
            var difference = userValue - average;
            $scope.percentile = (difference / average * 100).toFixed(1);


            if ($scope.percentile > 0) {
                $scope.string = " worse ";
                $scope.worseAverage = true;
            } else {
                $scope.string = " better ";
                $scope.betterAverage = true;
                $scope.percentile = Math.abs($scope.percentile);
            };


            var gas = pieData["saved_gas"].toFixed(2);
            var bike = pieData["bike"].toFixed(2);
            var light = pieData["lightbulb"].toFixed(2);
            var veg = pieData["veg"].toFixed(2);
            var heatDown = pieData["thermostat_down"];
            var heatUp = pieData["thermostat_up"];


            $scope.actions = [
                {
                    name: "gas",
                    caption: " Buy a more fuel efficient vehicle", 
                    value: gas 
                }, {
                    name: "bike",
                    caption: " Ride your bike 20 miles a week", 
                    value: bike
                }, {
                    name: "lightbulb",
                    caption: " Replace 5 lightbulbs with CFLs", 
                    value: light
                }, {
                    name: "veg",
                    caption: " Switch to a vegetarian diet",
                    value: veg
                }, {
                    name: "heatDown", 
                    caption: " Turn down the thermostat in winter",
                    value: heatDown
                }, {
                    name: "heatUp",
                    caption: " Turn up the thermostat in summer",
                    value: heatUp
                }
            ];
        });
    };


    $scope.calculateShow = function(pieData) {
        $scope.total = pieData["total"];
        $scope.cars = ($scope.total * 0.211).toFixed(1);
        $scope.waste = ($scope.total * 0.358).toFixed(1);
        $scope.oil = Math.ceil($scope.total * 2.3);
        $scope.homes = ($scope.total * 0.091).toFixed(2)
        $scope.trees = Math.ceil($scope.total * 25.6);
        $scope.acres = ($scope.total * 0.82).toFixed(2)
        $scope.turbines = ($scope.total * 0.0003).toFixed(4)

        $scope.cars_counter = Math.ceil($scope.cars);
        $scope.waste_counter = Math.ceil($scope.waste);
        $scope.acres_counter = Math.ceil($scope.acres);
        $scope.homes_counter = Math.ceil($scope.homes);
        $scope.turbines_counter = Math.ceil($scope.turbines);
        $scope.trees_counter = Math.ceil($scope.trees * 0.70);

        $scope.carsRange = [];
        for (var i = 0; i < $scope.cars_counter; i++) {
            $scope.carsRange.push(i);
        };
        $scope.wasteRange = [];
        for (var i = 0; i < $scope.waste_counter; i++) {
            $scope.wasteRange.push(i);
        };
        $scope.oilRange = [];
        for (var i =0; i < $scope.oil; i++) {
            $scope.oilRange.push(i);
        };
        $scope.homesRange = [];
        for (var i = 0; i < $scope.homes_counter; i++) {
            $scope.homesRange.push(i);
        };
        $scope.treesRange = [];
        for (var i = 0; i < $scope.trees; i++) {
            $scope.treesRange.push(i);
        };
        $scope.acresRange = [];
        for (var i = 0; i < $scope.acres_counter; i++) {
            $scope.acresRange.push(i);
        };
        $scope.turbinesRange = [];
        for (var i = 0; i < $scope.turbines_counter; i++){
            $scope.turbinesRange.push(i);
        };
    };


    $scope.sortActions = function() {
        $scope.descending = !$scope.descending;
    }
   


// -------------- SET UP CHARTS ----------------------
// ---------------------------------------------------


  $scope.drawPieChart = function(pieData) {
    var travel = (pieData["vehicle"] + pieData["public_transportation"] +pieData["air_travel"]);
    var housing = (pieData["home"] + pieData["electricity"] + pieData["natural_gas"] + pieData["heating"] + pieData["propane"]);
    var food = (pieData["meat"] + pieData["dairy"] + pieData["grains"] + pieData["fruit"] + pieData["other"]);

    $scope.updatingTotal = (travel + housing + food).toFixed(2);

    $scope.travelLegend = travel.toFixed(1);
    $scope.housingLegend = housing.toFixed(1);
    $scope.foodLegend = food.toFixed(1);



    var colors = ["#bf967a", "#b52d41", "#f06f5c"],

        categories = ['Travel', 'Home Energy', 'Food'],
        data = [{
            y: travel,
            color: colors[0],
            drilldown: {
                name: 'Travel',
                categories: ['Vehicle', 'Public<br> transportation', 'Air travel'],
                data: [pieData["vehicle"], pieData["public_transportation"], pieData["air_travel"]],
                color: colors[0]
            }
        }, {
            y: housing,
            color: colors[1],
            drilldown: {
                name: 'Home energy',
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
        credits: {
                enabled: false
        },
        chart: {
            type: 'pie',
            backgroundColor: 'transparent',
            borderColor: 'transparent',
            margin: [0,0,0,0]
        },
        title: {
            style: {
                fontSize: '2px'
            },
            text: ''
        },
        yAxis: {
            title: {
                text: 'MT CO2/year'
            }
        },
        plotOptions: {
            pie: {
                center: ['50%', '50%'],
                borderColor: 'transparent',
                borderWidth: 0,
                allowPointSelect: true
            },
        },
        tooltip: {
            headerFormat: '{point.key}: ',
            pointFormat: '{point.y:.2f} MT CO2',
            style: {
                fontSize: '12pt',
                padding: 13
            } 
        },
        navigation: {
            buttonOptions: {
                enabled: false
            }
        },
        series: [{
            // name: 'Total',
            data: totalData,
            size: '40%',
            dataLabels: {
                formatter: function () {
                    return this.y > 0 ? this.point.name : null;
                },
                color: 'black',
                distance: -30,
                style: {
                    fontSize: '17px',
                    textShadow: false,
                }
            }
        }, {
            // name: 'Total',
            data: subData,
            size: '70%',
            innerSize: '60%',
            dataLabels: {
                formatter: function () {
                    // display only if larger than 1
                    return this.y > 0.5 ? '<b>' + this.point.name + ':</b> ' + this.y.toFixed(2) + ' MT' : null;
                },
                color: 'black',
                distance: 19,
                style: {
                    fontSize: '13px',
                    textShadow: false
                }
            }
        }]
    });
  };    

    $scope.drawBarChart = function(barData) {

        var profile_names = barData[0];
        profile_names[0] = "You"
        var travel_data = barData[1];
        var housing_data = barData[2];
        var food_data = barData[3];

        var colors = ["#bf967a", "#b52d41", "#f06f5c"];

        $('#barChartContainer').highcharts({
            credits: {
                enabled: false
            },
            chart: {
                type: 'column',
                backgroundColor:'transparent',
                height: 400
            },
            title: {
                text: ''
            },
            xAxis: {
                lineWidth: 0.5,
                lineColor: '#cccccc', // grey
                categories: profile_names,
                labels: {
                    style: {
                        fontSize: '16px'
                    }
                }
            },
            yAxis: {
                min: 0,
                gridLineColor: '#cccccc', // grey
                gridLineWidth: .75,
                labels: {
                    style: {
                        fontSize: '14px'
                    }
                },
                title: {
                    margin: 20,
                    text: 'MT CO2 / year',
                    style: {
                        fontSize: '15px',
                    }
                },
                stackLabels: {
                    enabled: true,
                    style: {
                        fontWeight: 'bold',
                        fontSize: '14px',
                        textShadow: false,
                        color: (Highcharts.theme && Highcharts.theme.textColor) || 'black'
                    }
                }
            },
            legend: {
                align: 'right',
                x: -30,
                verticalAlign: 'top',
                y: 25,
                floating: false,
                backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
                borderColor: null,
                borderWidth: 1,
                shadow: false,
                itemStyle: {fontSize: '15px'}
            },
            tooltip: {
                // headerFormat: '{point.x}',
                pointFormat: '{series.name}: {point.y:.2f} MT CO2',
                // useHTML: true,
                style: {
                    fontSize: '12pt',
                    padding: 12
                },
               
            },
            plotOptions: {
                series: {
                    borderColor: null
                },
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true,
                        shadow: false,
                        color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'black',
                        style: {
                            textShadow: false,
                            fontSize: '14px'
                        },
                        formatter: function () {
                           return Highcharts.numberFormat(this.y,2);
                        }
                    }
                }
            },
            navigation: {
                buttonOptions: {
                    enabled: false
                }
            },
            series: [{
                name: 'Travel',
                data: travel_data,
                color: colors[0]
            }, {
                name: 'Home Energy',
                data: housing_data,
                color: colors[1]
            }, {
                name: 'Food',
                data: food_data,
                color: colors[2]
            }]
        });
    };

// --------------- UPDATE CHARTS -------------------------------
// -------------------------------------------------------------


    $scope.updatePieChart = function() {
        $http.get('/api/v1/footprints/:id.json').then(function(response) {
        
        var pieData = response.data;
        
        var pieChart = $('#pieChartContainer').highcharts();
        var travel = (pieData["vehicle"] + pieData["public_transportation"] +pieData["air_travel"]);
        var housing = (pieData["home"] + pieData["electricity"] + pieData["natural_gas"] + pieData["heating"] + pieData["propane"]);
        var food = (pieData["meat"] + pieData["dairy"] + pieData["grains"] + pieData["fruit"] + pieData["other"]);

        $scope.travelLegend = travel.toFixed(1);
        $scope.housingLegend = housing.toFixed(1);
        $scope.foodLegend = food.toFixed(1);

        scope.updatingTotal = (travel + housing + food).toFixed(2);

        var colors = ["#bf967a", "#b52d41", "#f06f5c"],
        categories = ['Travel', 'Home Energy', 'Food'],
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
                name: 'Home Energy',
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

        pieChart.series[0].setData(totalData, true);
        pieChart.series[1].setData(subData, true);
              
      });
    };




// ------------------- ONCLICK FUNCTIONS -------------------
// ---------------------------------------------------------

    $scope.decreaseChart = function() {
        $http.get('/api/v1/footprints/:id.json').then(function(response) {
            var pieData = response.data;
        $http.get('/api/v1/footprints.json').then(function(response) {
            var barData = response.data;
            $scope.changeCharts(pieData, barData);  
        });
      });
    };



    $scope.changeCharts = function(pieData, barData) {
    // set charts
        var pieChart = $('#pieChartContainer').highcharts();
        var barChart = $('#barChartContainer').highcharts();
    // get chart data
        var travel = (pieData["vehicle"] + pieData["public_transportation"] +pieData["air_travel"]);
        var housing = (pieData["home"] + pieData["electricity"] + pieData["natural_gas"] + pieData["heating"] + pieData["propane"]);
        var food = (pieData["meat"] + pieData["dairy"] + pieData["grains"] + pieData["fruit"] + pieData["other"]);
        var travelBar = barData[1];
        var housingBar = barData[2];
        var foodBar = barData[3];

        $scope.savedActions = [];
        $scope.totalSaved = 0;
    
        var gas = pieData["saved_gas"];
        var bike = pieData["bike"];
        var light = pieData["lightbulb"];
        var veg = pieData["veg"];
        var heatDown = pieData["thermostat_down"];
        var heatUp = pieData["thermostat_up"];



        var gasBox = document.getElementById("gas");
        var bikeBox = document.getElementById("bike");
        var lightBox = document.getElementById("lightbulb");
        var vegBox = document.getElementById("veg");
        var heatDownBox = document.getElementById("heatUp");
        var heatUpBox = document.getElementById("heatDown");

        if (gasBox.checked) {
            pieChart.series[1].data[0].update(pieData["vehicle"] - gas);
            pieChart.series[0].data[0].update(travel - gas);            
            barChart.series[0].data[0].update(travelBar[0] - gas);
                pieData["vehicle"] = pieData["vehicle"] - gas;
                travel = travel - gas;
                travelBar[0] = travelBar[0] - gas;
                $scope.savedActions.push(gas);
        } else if (!gasBox.checked) {
            pieChart.series[1].data[0].update(pieData["vehicle"]);
            pieChart.series[0].data[0].update(travel);
            barChart.series[0].data[0].update(travelBar[0]);  
        };
    

        if (bikeBox.checked) {
            pieChart.series[1].data[0].update(pieData["vehicle"] - bike);
            pieChart.series[0].data[0].update(travel - bike);
            barChart.series[0].data[0].update(travelBar[0] - bike);
                travel = travel - bike;
                travelBar[0] = travelBar[0] - bike;
                $scope.savedActions.push(bike);
        } else if (!gasBox.checked) {
            pieChart.series[1].data[0].update(pieData["vehicle"]);
            pieChart.series[0].data[0].update(travel);
            barChart.series[0].data[0].update(travelBar[0]); 
        };

        if (lightBox.checked) {
            pieChart.series[1].data[4].update(pieData["electricity"] - light);
            pieChart.series[0].data[1].update(housing - light);
            barChart.series[1].data[0].update(housingBar[0] - light);
                pieData["electricity"] = pieData["electricity"] - light;
                housing = housing - light;
                housingBar[0] = housingBar[0] - light;
                $scope.savedActions.push(light);
        } else if (!lightBox.checked){
            pieChart.series[1].data[4].update(pieData["electricity"]);
            pieChart.series[0].data[1].update(housing);
            barChart.series[1].data[0].update(housingBar[0]);
        };

        if (vegBox.checked) {
            pieChart.series[1].data[8].update(0);
            pieChart.series[0].data[2].update(food - veg);
            barChart.series[2].data[0].update(foodBar[0] - veg)
                pieData["meat"] = pieData["meat"] - veg;
                food = food - veg;
                foodBar[0] = foodBar[0] - veg;
                $scope.savedActions.push(veg);
        } else if (!vegBox.checked) {
            pieChart.series[1].data[8].update(pieData["meat"]);
            pieChart.series[0].data[2].update(food);
            barChart.series[2].data[0].update(foodBar[0]);
        };

        if (heatDownBox.checked){
            pieChart.series[1].data[3].update(pieData["natural_gas"] - heatDown);
            pieChart.series[0].data[1].update(housing - heatDown);
            barChart.series[1].data[0].update(housingBar[0] - heatDown);
                pieData["natural_gas"] = pieData["natural_gas"] - heatDown;
                housing = housing - heatDown;
                housingBar[0] = housingBar[0] - heatDown;
                $scope.savedActions.push(heatDown);
        } else if (!heatDownBox.checked){
            pieChart.series[1].data[3].update(pieData["natural_gas"]);
            pieChart.series[0].data[1].update(housing);
            barChart.series[1].data[0].update(housingBar[0]);
        };



        if (heatUpBox.checked){
            pieChart.series[1].data[4].update(pieData["electricity"] - heatDown);
            pieChart.series[0].data[1].update(housing - heatDown);
            barChart.series[1].data[0].update(housingBar[0] - heatown);
                pieData["electricity"] = pieData["electricity"] - heatDown;
                housing = housing - heatDown;
                housingBar[0] = housingBar[0] - heatDown;
                $scope.savedActions.push(heatDown);
        } else if (!heatUpBox.checked) {
            pieChart.series[1].data[4].update(pieData["electricity"]);
                pieChart.series[0].data[1].update(housing);
                barChart.series[1].data[0].update(housingBar[0]);
        };






        var total = 0;
        for (var i = 0; i < $scope.savedActions.length; i++) {
           total += $scope.savedActions[i]
        };

        $scope.totalSaved = parseFloat(total); 


        
    };






// ----------------- FORMS -------------------------------
// -------------------------------------------------------


            // SEND FORM 

    $scope.sendForm = function(formData, page, direction) {

        var urlString = "/api/v1/footprints/" + userId;
        $http.patch(urlString, formData).then(function(response){
            
            var type = formData["type"];
            if (type === "vehicle" || type === "heating" || type === "electricity") {
                 $scope.previousComplete = true; 
            };

            if (type !== "vehicle" && type !== "heating" && type !== "electricity" && $scope.previousComplete === true ) {
                $scope.updatePieChart();
                $scope.changePage(page, direction);  
                $scope.errors = "";         
            } else if (type !== "vehicle" && type !== "heating" && type !== "electricity" && $scope.previousComplete === false ) {
                $scope.errors = response.data.errors;
            };

            // if (type === "intro") {
            //     console.log("intro");
            //     $scope.firstName = "hi";
            // }

        }, function(response) { 
            $scope.errors = response.data.errors;
            console.log($scope.errors);
            console.log("error");
            var type = formData["type"];
            if (type === "vehicle" || type === "heating" || type === "electricity") {
                 $scope.previousComplete = false;
            };
        });
    };


// -------------- CHANGE ICONS -------------------------


    $scope.changePill = function(page, newPage) {
        $scope.pills[page-1].visible = false;
        $scope.pills[newPage-1].visible = true;
    };



    $scope.changePage = function(page, direction) {
    
        if (direction === 1) {
            var newPage = page - 1;
        } else if (direction === 2) {
            var newPage = page + 1;
            $scope.updateGauge(newPage);
        };

        if (newPage === 3) {
            $scope.chartInstructions = true;
            $timeout(function(){
                $scope.chartInstructions = false; 
            }, 5000);
        }

        var pageStr = 'a[href="#' + (newPage) + '"]';
        $(pageStr).tab('show');
        
        // $scope.changePill(page, newPage);
    };

    // $scope.thePlaceHolder = "hey";

    $scope.vehicleOptions = [
      { name: "Gasoline", factor: 8.887 }, 
      { name: "Diesel", factor: 10.18}
    ];

    $scope.fuelType = $scope.vehicleOptions[0];

    $scope.publicOptions = [
      { name: "Bus", factor: 300, placeholder: "165 miles"  }, 
      { name: "Commuter rail",  factor: 165, placeholder: "124 miles" }, 
      { name: "Transit Rail", factor: 160, placeholder: "83 miles" }, 
      { name: "Amtrak", factor: 191, placeholder: "41 miles" }
    ];

    $scope.publicType = $scope.publicOptions[0];

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
        $scope.sendForm(formData[i], 2, direction);
      };

    };

    $scope.submitAir = function(airMiles, direction) {
      var formData = {
        type: "air_travel",
        miles: airMiles
      };
      $scope.sendForm(formData, 3, direction);
    }

    $scope.electricityOptions = [
        { name: "$/year", factor: 0.0834, placeholder: "$1,020" },
        { name: "kWh/year", factor: 1, placeholder: "10,737 kWh" }
    ];

    $scope.electricityType = $scope.electricityOptions[0];

    $scope.naturalOptions = [ 
      { name: "$/year", factor: 1.18, placeholder: "$550" },
      { name: "Therms/year", factor: 1, placeholder: "443 Therms"}, 
      { name: "Cu.Ft/year", factor: 100, placeholder: "43,300 Cu.Ft" }
    ];

    $scope.naturalType = $scope.naturalOptions[0];

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
        $scope.sendForm(formData[i], 4, direction);
      };

    };

    $scope.heatingOptions = [
      { name: "$/year", factor: 4.02, placeholder: "$862" },
      { name: "gallons/year", factor: 1, placeholder: "214 gallons" }
    ];

    $scope.heatingType = $scope.heatingOptions[0];

    $scope.propaneOptions = [
      {name: "$/year", factor: 2.47, placeholder: "$380" },
      { name: "gal/year", factor: 1, placeholder: "150 gallons" }
    ];

    $scope.propaneType = $scope.propaneOptions[0];

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
        $scope.sendForm(formData[i], 5, direction);
      };

    };

    $scope.submitHome = function(homeSqft, direction) {
        var formData = { type: "home", sqft: homeSqft };

        $scope.sendForm(formData,6, direction);
    };


    $scope.meat = { value: 1 }
    $scope.dairy = { value: 1 }
    $scope.grains = { value: 1 }
    $scope.fruit = { value: 1 }
    $scope.other = { value: 1 }


    $scope.submitFood = function(meatValue, dairyValue, grainsValue, fruitValue, otherValue, direction) {
      
        var formData = [
            { type: "meat", factor: meatValue }, 
            { type: "dairy", factor: dairyValue },
            { type: "grains", factor: grainsValue }, 
            { type: "fruit", factor: fruitValue }, 
            { type: "other", factor: otherValue }
        ];
      
        for (var i = 0; i < formData.length; i++) {
            $scope.sendForm(formData[i], 7, direction);
        };

    };



  // ---------- sliders -------------------------------



  // MEAT

    d3.select("#nValueMeat").on("input", function () {
      updateMeat(+this.value);
    });

    updateMeat(1);

    function updateMeat(nValueMeat) {
      d3.select("#text-slider-meat").text(nValueMeat);
      d3.select("#nValueMeat").property("value", nValueMeat);
    }

    // DAIRY

    d3.select("#nValueDairy").on("input", function () {
      updateDairy(+this.value);
    });

    updateDairy(1);

    function updateDairy(nValueDairy) {
      d3.select("#text-slider-dairy").text(nValueDairy);
      d3.select("#nValueDairy").property("value", nValueDairy);
    }

    // GRAINS

    d3.select("#nValueGrains").on("input", function () {
      updateGrains(+this.value);
    });

    updateGrains(1);

    function updateGrains(nValueGrains) {
      d3.select("#text-slider-grains").text(nValueGrains);
      d3.select("#nValueGrains").property("value", nValueGrains);
    }

    // FRUIT

    d3.select("#nValueFruit").on("input", function () {
      updateFruit(+this.value);
    });

    updateFruit(1);

    function updateFruit(nValuefruit) {
      d3.select("#text-slider-fruit").text(nValuefruit);
      d3.select("#nValueFruit").property("value", nValuefruit);
    }


    // OTHER

    d3.select("#nValueOther").on("input", function () {
      updateOther(+this.value);
    });

    updateOther(1);

    function updateOther(nValueOther) {
      d3.select("#text-slider-Other").text(nValueOther);
      d3.select("#nValueOther").property("value", nValueOther);
    }




// ---------- SUBMIT INTRO!!!!!! ------------------------


    $scope.stateOptions = [
        { name: 'Alabama', abbreviation: 'AL'},
        { name: 'Alaska', abbreviation: 'AK'},
        { name: 'Arizona', abbreviation: 'AZ'},
        { name: 'Arkansas', abbreviation: 'AR'},
        { name: 'California', abbreviation: 'CA'},
        { name: 'Colorado', abbreviation: 'CO'},
        { name: 'Connecticut', abbreviation: 'CT'},
        { name: 'Delaware', abbreviation: 'DE'},
        { name: 'District of Columbia', abbreviation: 'DC'},
        { name: 'Florida', abbreviation: 'FL'},
        { name: 'Georgia', abbreviation: 'GA'},
        { name: 'Hawaii', abbreviation: 'HI'},
        { name: 'Idaho', abbreviation: 'ID'},
        { name: 'Illinois', abbreviation: 'IL'},
        { name: 'Indiana', abbreviation: 'IN'},
        { name: 'Iowa', abbreviation: 'IA'},
        { name: 'Kansas', abbreviation: 'KS'},
        { name: 'Kentucky', abbreviation: 'KY'},
        { name: 'Louisiana', abbreviation: 'LA'},
        { name: 'Maine', abbreviation: 'ME'},
        { name: 'Maryland', abbreviation: 'MD'},
        { name: 'Massachusettes', abbreviation: 'MA'},
        { name: 'Michican', abbreviation: 'MI'},
        { name: 'Minnesota', abbreviation: 'MN'},
        { name: 'Mississippi', abbreviation: 'MS'},
        { name: 'Missouri', abbreviation: 'MO'},
        { name: 'Montana', abbreviation: 'MT'},
        { name: 'Nebraska', abbreviation: 'NE'},
        { name: 'Nevada', abbreviation: 'NV'},
        { name: 'New Hampshire', abbreviation: 'NH'},
        { name: 'New Jersey', abbreviation: 'NJ'},
        { name: 'New Mexico', abbreviation: 'NM'},
        { name: 'New York', abbreviation: 'NY'},
        { name: 'North Carolina', abbreviation: 'NC'},
        { name: 'North Dakota', abbreviation: 'ND'},
        { name: 'Ohio', abbreviation: 'OH'},
        { name: 'Oklahoma', abbreviation: 'OK'},
        { name: 'Oregon', abbreviation: 'OR'},
        { name: 'Pennsylvania', abbreviation: 'PA'},
        { name: 'Rhode Island', abbreviation: 'RI'},
        { name: 'South Carolina', abbreviation: 'SC'},
        { name: 'South Dakota', abbreviation: 'SD'},
        { name: 'Tennessee', abbreviation: 'TN'},
        { name: 'Texas', abbreviation: 'TX'},
        { name: 'Utah', abbreviation: 'UT'},
        { name: 'Vermont', abbreviation: 'VT'},
        { name: 'Virginia', abbreviation: 'VA'},
        { name: 'Washington', abbreviation: 'WA'},
        { name: 'West Virginia', abbreviation: 'WV'},
        { name: 'Wisconsin', abbreviation: 'WI'},
        { name: 'Wyoming', abbreviation: 'WY' }
    ];

    $scope.stateInput = $scope.stateOptions[0];

    $scope.submitIntro = function(firstName, lastName, stateInput, direction) {
        var formData = {
            type: "intro",
            first_name: firstName,
            last_name: lastName,
            state: stateInput.abbreviation
        };

        $scope.sendForm(formData, 1, direction);
    };


    window.scope=$scope;

// ------------ MODAL -----------------------------------

    $scope.showCharts = function() {
        $scope.modalVisible = false;
        $scope.resultsVisible = true;
        $scope.toggleInstructions = true;

        $timeout(function() {
            $scope.toggleInstructions = false;
        }, 5000);
    };

    $scope.switchChart = function(chartType) {
        $scope.content = chartType;

    };

    $scope.checkChart = function(chartType) {
        return $scope.content === chartType;
    };


    $scope.charts = [
        { caption: "Your carbon footprint" },
        { caption: "Here's how you stack up against other users" },
        { caption: "Electricity use and meat intake vs. overall footprint"}
    ];


// -------------- BUBBLE CHART ------------------------



    $scope.drawBubbleChart = function(bubbleData){
        console.log(bubbleData);
        var meatData = bubbleData[4];
        var kwData = bubbleData[5];
        var totalData = bubbleData[6];
        var states = bubbleData[7];

        var chartData = [];
        for (var i = 0; i < 20; i++){
            var obj = {
                x: meatData[i],
                y: kwData[i],
                z: totalData[i],
                name: states[i]
            };
            chartData.push(obj);
        };

        $('#bubbleContainer').highcharts({

        chart: {
            type: 'bubble',
            plotBorderWidth: 1,
            zoomType: 'xy',
            height: 400,
            backgroundColor: 'transparent'
        },
        credits: {
            enabled: false
        },
        legend: {
            enabled: false
        },

        title: {
            text: ''
        },
        xAxis: {
            gridLineWidth: 1,
            gridLineColor: '#cccccc',
            title: {
                text: 'MT CO2 from electricity use',
                margin: 20, 
                style: {
                    fontSize: '16px'
                },
            },
            labels: {
                format: '{value} MT'
            }
        },

        yAxis: {
            startOnTick: false,
            endOnTick: false,
            title: {
                text: 'MT CO2 from meat intake',
                margin: 20, 
                style: {
                    fontSize: '16px'
                },
            },
            labels: {
                format: '{value} MT'
            },
            maxPadding: 0.2,
            gridLineWidth: 1,
            gridLineColor: '#cccccc'
        },
        tooltip: {
            useHTML: true,
            headerFormat: '<table>',
            pointFormat: 
                '<tr><th>Electricity use:</th><td>{point.x} MT</td></tr>' +
                '<tr><th>Meat intake:</th><td>{point.y} MT</td></tr>' +
                '<tr><th>Overall footprint:</th><td>{point.z} MT</td></tr>',
            footerFormat: '</table>',
            followPointer: true,
            style: {
                fontSize: '12pt'
            }
        },

        plotOptions: {
            series: {
                dataLabels: {
                    enabled: true,
                    format: '{point.name}'
                }
            }
        },
        navigation: {
            buttonOptions: {
                 enabled: false
            }
        },
        series: [{
            data: chartData,
            color: '#b52d41'
            }]
        });
    };




    $scope.drawGauge = function() {
        $('#gaugeContainer').highcharts({
        // Highcharts.chart('#gaugeContainer', {
            chart: {
                type: 'solidgauge',
                marginTop: 10,
                backgroundColor:'transparent'
            },
            credits: {
                enabled: false
            }, 
            navigation: {
                buttonOptions: {
                    enabled: false
                }
            },
            title: {
                text: '',
                style: {
                    fontSize: '1px'
                }
            },
            tooltip: {
               enabled: false
            },
            pane: {
                startAngle: 0,
                endAngle: 360,
                background: { // Track for Move
                    outerRadius: '112%',
                    innerRadius: '88%',
                    backgroundColor: Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0.3).get(),
                    borderWidth: 0
                } 
            },
            yAxis: {
                min: 0,
                max: 100,
                lineWidth: 0,
                tickPositions: []
            },
            plotOptions: {
                solidgauge: {
                    borderWidth: '12px',
                    dataLabels: {
                        enabled: true,
                        borderWidth: 0,
                        format: '{y:.0f} %',
                        y: -18,
                        style: {
                            fontSize: '18px'
                        }
                    },
                    linecap: 'round',
                    stickyTracking: false
                }
            },
            series: [{
                name: 'Move',
                borderColor: Highcharts.getOptions().colors[0],
                data: [{
                    color: Highcharts.getOptions().colors[0],
                    radius: '100%',
                    innerRadius: '100%',
                    y: 0 // this is the point to update !!
                }]
            }]
        },
    /* In the chart load callback, add icons on top of the circular shapes */
        function callback() {
            // Move icon
            this.renderer.path(['M', -8, 0, 'L', 8, 0, 'M', 0, -8, 'L', 8, 0, 0, 8])
                .attr({
                    'stroke': '#303030',
                    'stroke-linecap': 'round',
                    'stroke-linejoin': 'round',
                    'stroke-width': 2,
                    'zIndex': 10
                })
                .translate(190, 26)
            
        });

        var chart = $('#gaugeContainer').highcharts();
        // console.log(chart.series[0].data[0].y);
    };

    $scope.updateGauge = function(page) {
        var y = (page-1) / 8 * 100;
        var chart = $('#gaugeContainer').highcharts();
        chart.series[0].data[0].update(y);
    };


/// --------- SMALL PIE CHART -------------------------

    $scope.drawSmallPieChart = function(pieData) {
        var travel = pieData["travel"];
        var housing = pieData["housing"];
        var food = pieData["food"];
        var colors = ["#bf967a", "#b52d41", "#f06f5c"];
        $scope.travelTot = travel;
        $scope.housingTot = housing;
        $scope.foodTot = food;

        Highcharts.setOptions({ colors: ["#bf967a", "#b52d41", "#f06f5c"]});

        $('#smallPieContainer').highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie',
                backgroundColor: 'transparent'
            },
            legend: {
                align: 'right',
                verticalAlign: 'top',
                layout: 'vertical',
                margin: 10,
                itemMarginBottom: 8
            },
            title: {
                text: '',
                fontSize: '2px'
            },
            credits: { enabled: false },
            navigation: {
                buttonOptions: {
                    enabled: false
                }
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: { enabled: false },
                    // showInLegend: true,
                    size: 100
                }
            },
            series: [{
                name: 'Total',
                colorByPoint: true,
                data: [
                  { name: 'Travel', y: travel }, 
                  { name: 'Home Electricity', y: housing }, 
                  { name: 'Food', y: food }
                ]
            }]
        });
    };




  });
}());