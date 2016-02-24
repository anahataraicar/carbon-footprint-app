$(function() {

  var data = gon.habits;


  // var bikeCalc = function(){
    //some code here
  //   return 
  // }

  // var carCalc = function(){

  // }
  
  
  var x = document.getElementById("vehicle")
  x.onclick = function checkCar() {
      if (x.checked) {
        myDonutChart.segments[0].value = data["vehicle"] - gon.saved_gas;
      } else if (!x.checked) {
        myDonutChart.segments[0].value = data["vehicle"]
      }
      myDonutChart.update();
  };



  var doughnutData = [
    {
      value: data["vehicle"],
      color:"#F7464A",
      highlight: "#FF5A5E",
      label: "Vehicle"
    },
    {
      value: data["public_transportation"],
      color: "#46BFBD",
      highlight: "#5AD3D1",
      label: "Public Transportation"
    },
    {
      value: data["air_travel"],
      color: "#FDB45C",
      highlight: "#FFC870",
      label: "Air Travel"
    },
    {
      value: data["electricity"],
      color: "#40BF80",
      highlight: "#8CD9B3",
      label: "Electricity" 
    },
    {
      value: data["natural_gas"],
      color: "#4775d1",
      highlight: "#85a3e0",
      label: "Natural gas" 
    },
    {
      value: (data["heating"] + data["propane"]).toFixed(2),
      color: "#666699",
      highlight: "#8585ad",
      label: "Heating" 
    },
    {
      value: (data["meat"] + data["dairy"] + data["grains"] + data["fruit"] + data["other"]).toFixed(2),
      color: "#ff99cc",
      highlight: "#ffcce6",
      label: "Food" 
    },
    {
      value: data["home"],
      color: "#ffff99",
      highlight: "#ffffcc",
      label: "Heating" 
    }
  ];


  var options = {

    legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"
  }

  var ctx = document.getElementById("myPieChart").getContext("2d");
  var myDonutChart = new Chart(ctx).Pie(doughnutData,options);

  document.getElementById('js-legend').innerHTML = myDonutChart.generateLegend();

});

      