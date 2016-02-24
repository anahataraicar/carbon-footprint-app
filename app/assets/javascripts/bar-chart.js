$(function() {

  var data = gon.profiles;

  options = {
    scaleGridLineColor : "rgb(200,200,200)"
  };


  var barData = {
    labels: ["You", "Dustin", "John"],
    datasets: [
        {
            // label: "You",
            fillColor: "#8CD9B3",
            strokeColor: "rgba(220,220,220,0.8)",
            highlightFill: "rgba(220,220,220,0.75)",
            highlightStroke: "rgba(220,220,220,1)",
            data: [data["Zoe"], data["Dustin"], data["John"]]
        }
    ]
  };

  var ctx = document.getElementById("myBarChart").getContext("2d");
  var myBarChart = new Chart(ctx).Bar(barData, options);

})