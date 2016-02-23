$(function() {


  var data = gon.habits;
  // var bikeCalc = function(){
    //some code here
  //   return 
  // }

  // var carCalc = function(){

  // }

  function change() {
    var x = document.getElementById("vehicle").checked;
    alert(x);
  };


  function check() {
    if (document.getElementById("vehicle").checked == true) {
      myDonutChart.segments[0].value = data["vehicle"] - gon.saved_gas;
      myDonutChart.update();
    };
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
    }
  ];


  var options = {

    legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"
  }



  var ctx = document.getElementById("myChart").getContext("2d");
  var myDonutChart = new Chart(ctx).Doughnut(doughnutData,options);

  document.getElementById('js-legend').innerHTML = myDonutChart.generateLegend();

});

      