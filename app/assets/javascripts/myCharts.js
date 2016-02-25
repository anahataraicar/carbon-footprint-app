// $(function() {

//   var pie_data = gon.habits;

//   // var bikeCalc = function(){
//     //some code here
//   //   return 
//   // }

//   // var carCalc = function(){
//   // }
  
//   var PieData = [
//     {
//       value: pie_data["vehicle"],
//       color:"#F7464A",
//       highlight: "#FF5A5E",
//       label: "Vehicle"
//     },
//     {
//       value: pie_data["public_transportation"],
//       color: "#46BFBD",
//       highlight: "#5AD3D1",
//       label: "Public Transportation"
//     },
//     {
//       value: pie_data["air_travel"],
//       color: "#FDB45C",
//       highlight: "#FFC870",
//       label: "Air Travel"
//     },
//     {
//       value: pie_data["electricity"],
//       color: "#40BF80",
//       highlight: "#8CD9B3",
//       label: "Electricity" 
//     },
//     {
//       value: pie_data["natural_gas"],
//       color: "#4775d1",
//       highlight: "#85a3e0",
//       label: "Natural gas" 
//     },
//     {
//       value: (pie_data["heating"] + pie_data["propane"]).toFixed(2),
//       color: "#666699",
//       highlight: "#8585ad",
//       label: "Heating" 
//     },
//     {
//       value: (pie_data["meat"] + pie_data["dairy"] + pie_data["grains"] + pie_data["fruit"] + pie_data["other"]).toFixed(2),
//       color: "#ff99cc",
//       highlight: "#ffcce6",
//       label: "Food" 
//     },
//     {
//       value: pie_data["home"],
//       color: "#ffff99",
//       highlight: "#ffffcc",
//       label: "Heating" 
//     }
//   ];


//   var options = {

//     legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"
//   }

//   var ctx = document.getElementById("myPieChart").getContext("2d");
//   var myPieChart = new Chart(ctx).Pie(PieData,options);
//   document.getElementById('js-legend').innerHTML = myPieChart.generateLegend();

//   //------------------------------------------------------------
//   //--------------------------BARCHART---------------------------


//   var profile_data = gon.profiles;

//   var barData = {
//     labels: ["You", "Dustin", "John"],
//     datasets: [
//         {
//             // label: "You",
//             fillColor: "#8CD9B3",
//             strokeColor: "rgba(220,220,220,0.8)",
//             highlightFill: "rgba(220,220,220,0.75)",
//             highlightStroke: "rgba(220,220,220,1)",
//             data: [profile_data["Zoe"], profile_data["Dustin"], profile_data["John"]]
//         }
//     ]
//   };

//   options = {
//     scaleGridLineColor : "rgb(200,200,200)",
//     barValueSpacing : 20
//   };

//   var context = document.getElementById("myBarChart").getContext("2d");
//   var myBarChart = new Chart(context).Bar(barData, options);

//   //----------------------------------------------------------------
//   //---------------------ONCLICK FUNCTIONS--------------------------

//   var x = document.getElementById("vehicle")
//   x.onclick = function checkCar() {
//       if (x.checked) {
//         myPieChart.segments[0].value = pie_data["vehicle"] - gon.saved_gas;
//         myBarChart.datasets[0].bars[0].value = profile_data["Zoe"] - gon.saved_gas
//       } else if (!x.checked) {
//         myPieChart.segments[0].value = pie_data["vehicle"]
//         myBarChart.datasets[0].bars[0].value = profile_data["Zoe"]
//       }
//       myPieChart.update();
//       myBarChart.update();
//       document.getElementById("updated-footprint").innerHTML = myBarChart.datasets[0].bars[0].value
//   };


// });

//       