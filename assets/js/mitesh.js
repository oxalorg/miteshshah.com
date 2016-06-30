$(document).ready(function(){
        $("#closeOverlay").on("click", function(e){
            console.log('close');
            $("#overlay").hide();
            e.stopPropagation();
        });

        $("body").on("click", function(){
            console.log('body');
            if($("#overlay").is(":visible")){
                $("#overlay").hide();
            }
        });

        $("#about").on("click", function(e){
            console.log('about');
            $("#overlay").show();
            e.stopPropagation();
        });

        $("#overlay").on("click", function(e){
            e.stopPropagation();
        });

});
