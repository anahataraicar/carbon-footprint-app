$(document).ready(function(){
  
  $(form).on('submit', function(e){

    var formData = $('this').serialize();
     
    // console.log(formData);
    
    e.preventDefault();

    $.ajax({
      type: "POST",
      url: "/footprints/1",
      data: formData,
      dataType: "JSONP"
      });

    console.log("hello");
  });
});