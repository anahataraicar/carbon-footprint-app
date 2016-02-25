$(document).ready(function(){
  $("form").on('submit', function(e){
    var Formdata = $('form').serialize();
    console.log(Formdata);
    e.preventDefault();
    $.ajax({
      url: "/footprints/1",
      method: "patch",
      data: Formdata
      });
    console.log("hello");
  });
});