$(function () {

    var pieData = gon.habits;
    var travel = (pieData["vehicle"] + pieData["public_transportation"] +pieData["air_travel"]);
    var housing = (pieData["home"] + pieData["electricity"] + pieData["natural_gas"] + pieData["heating"] + pieData["propane"]);
    var food = (pieData["meat"] + pieData["dairy"] + pieData["grains"] + pieData["fruit"] + pieData["other"]);

    // var colors = Highcharts.getOptions().colors,
    var colors = ["#2b908f", "#f45b5b", "#91e8e1"],

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
                fontSize: '30px'
            },
            text: 'Your carbon footprint'
        },
        subtitle: {
            text: 'Some subtitle text',
            style: {
                fontSize: '20px'
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
                    fontSize: '15px'
                }
            }
        }]
    });



// -------------------- BAR CHART --------------------------
// ---------------------------------------------------------



    var profileData = gon.profiles;

    $('#barChartContainer').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: 'Uesr footprints'
        },
        xAxis: {
            categories: ['You', 'Dustin', 'John']
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
            data: [5, 3, 4],
            color: colors[0]
        }, {
            name: 'Housing',
            data: [2, 2, 3],
            color: colors[1]
        }, {
            name: 'Food',
            data: [3, 4, 4],
            color: colors[2]
        }]
    });



// ------------------- ONCLICK FUNCTIONS -------------------
// ---------------------------------------------------------


    var pieChart = $('#pieChartContainer').highcharts();
    var barChart = $('#barChartContainer').highcharts();


    var x = document.getElementById("vehicleFunction")
    x.onclick = function checkCar() {
        if (x.checked) {
            pieChart.series[1].data[0].update(pieData["vehicle"] - gon.saved_gas);
            pieChart.series[0].data[0].update(travel - gon.saved_gas);

        } else if (!x.checked) {
            pieChart.series[1].data[0].update(pieData["vehicle"]);
            pieChart.series[0].data[0].update(travel);
        }
        // document.getElementById("updated-footprint").innerHTML = barChart
    };

    console.log(barChart.series[0].data[0]);

});



