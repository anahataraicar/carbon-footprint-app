$(document).ready(function(){
  
  $("form").on('submit', function(e){

    var Formdata = $('form').serialize();
    
    console.log(Formdata);
    
    e.preventDefault();

    console.log( $( this ).serialize() );

    $.ajax({
      url: "/footprints/1",
      method: "patch",
      data: Formdata
      });

    console.log("hello");
  });
});