(function() {
  "use strict";

  angular.module("app").controller("editCtrl", function($scope, $http) {

    var userId = gon.user_id;


    $scope.setUpCharts = function() {
      $http.get('/api/v1/footprints/:id.json').then(function(response) {
          var pieData = response.data;
          $scope.drawPieChart(pieData);
      });

      $http.get('/api/v1/footprints.json').then(function(response) {
          var barData = response.data;
          $scope.drawBarChart(barData);
      });
    };

    $scope.init = function() {
        $scope.setUpCharts();
        $scope.content = "pie";
    };




      
// -------------- SET UP CHARTS -------------------------
// ---------------------------------------------------


      
  $scope.drawPieChart = function(pieData) {
    var travel = (pieData["vehicle"] + pieData["public_transportation"] +pieData["air_travel"]);
    var housing = (pieData["home"] + pieData["electricity"] + pieData["natural_gas"] + pieData["heating"] + pieData["propane"]);
    var food = (pieData["meat"] + pieData["dairy"] + pieData["grains"] + pieData["fruit"] + pieData["other"]);


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
  };    

    $scope.drawBarChart = function(barData) {

        var profile_names = barData[0];
        profile_names[0] = "You"
        var travel_data = barData[1];
        var housing_data = barData[2];
        var food_data = barData[3];

        var colors = ["#2b908f", "#4d4dff", "#91e8e1"];

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
                pointFormat: '{series.name}: {point.y:.2f}<br/>Total: {point.stackTotal}',

            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true,
                        color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                        style: {
                            textShadow: '0 0 3px black'
                        },
                        formatter: function () {
                           return Highcharts.numberFormat(this.y,2);
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

        pieChart.series[0].setData(totalData, true);
        pieChart.series[1].setData(subData, true);
              
      });
    };

    $scope.updateBarChart = function(){
        $http.get('/api/v1/footprints.json').then(function(response) {

            var barData = response.data;

            var profile_names = barData[0];
            var travel_data = barData[1];
            var housing_data = barData[2];
            var food_data = barData[3];
            


            var barChart = $('#barChartContainer').highcharts();
            
            var colors = ["#2b908f", "#4d4dff", "#91e8e1"];

            var barSeries = [{
                data: travel_data
            }, {
                data: housing_data
            }, {
                data: food_data
            }];

            // console.log(barSeries)
            barChart.series[0].setData(barSeries, true);


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
        var profile_names = barData[0];
        var travel_data = barData[1];
        var housing_data = barData[2];
        var food_data = barData[3];

    // new calculations
        var newTravel = travel_data[0];
        var totalFootprint = food_data[0] + housing_data[0] + travel_data[0];


    // change charts
        var x = document.getElementById("saveGas")
        if (x.checked) {
            pieChart.series[1].data[0].update(pieData["vehicle"] - gon.saved_gas);
            pieChart.series[0].data[0].update(travel - gon.saved_gas);            
            barChart.series[0].data[0].update(travel_data[0] - gon.saved_gas);
            


        } else if (!x.checked) {
            pieChart.series[1].data[0].update(pieData["vehicle"]);
            pieChart.series[0].data[0].update(travel);
            barChart.series[0].data[0].update(newTravel);
            
        };
    };



// ----------------- FORMS -------------------------------
// -------------------------------------------------------


            // SEND FORM 

    $scope.sendForm = function(formData, page, direction) {

        var urlString = "/api/v1/footprints/" + userId;        

        $http.patch(urlString, formData).then(function(response){
            
            $scope.updatePieChart();
            $scope.updateBarChart();

            $scope.changePage(page, direction)

        }, function(response) { 

            $scope.errors = response.data.errors;
            $scope.clicked = true; 

        });

       

    };


// -------------- CHANGE ICONS -------------------------

    $scope.pills = [
        { name: "intro", visible: false }
    ];







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
      { name: "Gasoline", factor: 8.887 }, 
      { name: "Diesel", factor: 10.18}
    ];

    $scope.fuelType = $scope.vehicleOptions[0];

    $scope.publicOptions = [
      { name: "Bus", factor: 300 }, 
      { name: "Commuter rail",  factor: 165 }, 
      { name: "Transit Rail", factor: 160 }, 
      { name: "Amtrak", factor: 191 }
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
      { name: "kWh/year", factor: 1 },
      { name: "$/year", factor: 0.1015 }
    ];

    $scope.electricityType = $scope.electricityOptions[1];

    $scope.naturalOptions = [
      { name: "Therms/year", factor: 1 }, 
      { name: "$/year", factor: 0.0950 }, 
      { name: "Cu.Ft/year", factor: 8.9 }
    ];

    $scope.naturalType = $scope.naturalOptions[1];

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
      { name: "gal/year", factor: 1 }, 
      { name: "$/year", factor: 4.02 }
    ];

    $scope.heatingType = $scope.heatingOptions[0];

    // literally made up this value 4.00
    $scope.propaneOptions = [
      { name: "gal/year", factor: 1 }, 
      {name: "$/year", factor: 4.00 }
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


    $scope.submitFood = function(meatValue, dairyValue, grainsValue, fruitValue, otherValue, direction) {

        $scope.foodData = [];
      
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



  // sliders ----------------------------------------------


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


// ------------------- ERRORS --------------------------




    

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





  });
}());