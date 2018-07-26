// Editeur de Pixelart!

$(function (){

  // Déclaration des variables
  
  var xchoice = $("#oeuvre_largeur").val(), ychoice = $("#oeuvre_hauteur").val(), color_div = 'rgb(255, 255, 255)', gomme = false, click_mouseover = false, pix_list = $('#oeuvre_tableau').val(), color_compteur = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], color_index = ["#810000","#ff5a5a","#ff0000","#a34f00","#ffa551","#ff7b00","#b19f00","#ffee56","#ffe600","#2fa500","#7bff47","#48ff00","#00a098","#57fff7","#00fff2","#001b94","#4a6bff","#002fff","#6500a0","#be4fff","#9e00fa","#97008b","#ff4bf0","#ff00ea","#acacac","#585858","#000000","#c0883f","#c06d00","#6e3f00","#ffffff"];

// Compteur couleur


            function colorCount()
            {
              color_compteur = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
              $.each(color_index, function(key, element){
            
                var verif_index = color_index[key];
      
                $.each(pix_list, function(key2, element){
                  var verif_color = pix_list[key2];
      
      
                  if ( verif_color == verif_index){
                    color_compteur[key] += 1;
                    
                  }
      
      
              });
            });
            console.log(color_compteur);
            $('#oeuvre_compteur').val( JSON.stringify(color_compteur));
              
            };

       


  if ( pix_list == []){
    createPixels (xchoice, ychoice);
  }else{
    regeneratePixels(xchoice, ychoice);
  }

  $("#oeuvre_largeur, #oeuvre_hauteur ").change(function () { // choix de la taille
    $('.post_it').remove(); // on nettoie le div
    xchoice = $("#oeuvre_largeur").val();
    ychoice = $("#oeuvre_hauteur").val();
    if (xchoice >= 5 && xchoice <= 40 && ychoice >= 5 && ychoice <= 40) {
      createPixels(xchoice, ychoice);
    }
    else {
      alert('Les valeurs valides sont comprisent entre 5 et 40 pixels');
    }

    if (xchoice > 40) {
      $("#oeuvre_largeur").val(40);
      xchoice = 40;
      createPixels(xchoice, ychoice);

    }
    if (xchoice < 5) {
      $("#oeuvre_largeur").val(5);
      xchoice = 5;
      createPixels(xchoice, ychoice);
    }

    if (ychoice > 40) {
      ychoice = $("#oeuvre_hauteur").val(40);
      ychoice = 40;
      createPixels(xchoice, ychoice);
    }
    if (ychoice < 5) {
      ychoice = $("#oeuvre_hauteur").val(5);
      ychoice = 5;
      createPixels(xchoice, ychoice);
    }
  });
  
  
    // CONVERTION COULEUR EN HEXADECIMALE
  
       function rgb2hex(rgb){
        rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
        return (rgb && rgb.length === 4) ? "#" +
         ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
         ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
         ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
       }
  
  
  
  function createPixels (xnbr, ynbr){
      var k = -1;
      pix_list = [];
          for(var i = 0; i < ynbr; i++  ) 
          {
              for(var j = 0; j < xnbr; j++  )
              {
                   k++;
                   pix_list[k] = 0; // on Initialise le tableau temporaire
                  $('<div class="post_it" style="background-image : rgba(255, 255, 255, 0.0) "></div>').data("div_id", k).appendTo( "#post_cont" );// Le pixel est un Div de 25px/25
                   // creation du tableauk= j*i;
                }
          } 
          var taillex = xnbr * 15;
          var tailley = ynbr * 15;
          $(".main-editor").css('height', tailley + 'px' );
          $(".main-editor").css('width', taillex + 'px' ); //La taille du div s'adapte au nobre de pixels
  } // Fin de createPixels
  

  function regeneratePixels (xnbr, ynbr){
    var k = -1;
    pix_list_temp = JSON.parse(pix_list);
    pix_list= [];

    for(var x in pix_list_temp){
      pix_list.push(pix_list_temp[x]);
    }
    $.each(pix_list, function( key, j) {
      k++;
      if ( j == 0)
      {
        $('<div class="post_it" style="background-color : rgba(255, 255, 255, 0.0) "></div>').data("div_id", k).appendTo( "#post_cont" );// Le pixel est un Div de 25px/25

      }else{
        $('<div class="post_it"></div>').eq(0).css('backgroundColor', j ).data("div_id", k).appendTo( "#post_cont" );// Le pixel est un Div de 25px/25

      }
    }
    )
        var taillex = xnbr * 15;
        var tailley = ynbr * 15;
        $(".main-editor").css('height', tailley + 'px' );
        $(".main-editor").css('width', taillex + 'px' ); //La taille du div s'adapte au nobre de pixels
} // Fin de regeneratePixels


  // LE PICKER COLOR
  $('.picker-color').click( function(){
    color_div = $(this).css('backgroundColor');
    $('.color_selector_div').css('backgroundColor', color_div);
    gomme = false;
  });
  
  // Le Color SELECTOR ( Affiche la couleur selectionné)
  $('.color_selector_div').css('backgroundColor', color_div);
  
  // LE PINCEAU/GOMME
  
  $("#post_cont").on('click', '.post_it', function(){
    var data_recup = 0;
    if (gomme == false)
    {
      var pinceau = $(this).css('backgroundColor', color_div );
      var data_recup = $(this).data("div_id") // on recupère l'id du div
      
      pix_list[data_recup] = rgb2hex(color_div); // on injecte la couleur dans le tableau
      console.log(pix_list);
      colorCount()
      $('#oeuvre_tableau').val( JSON.stringify(pix_list) );
    }else{
      var pinceau = $(this).css({'backgroundColor':'rgba(255, 255, 255, 0.0)'});
      var data_recup = $(this).data("div_id") // on recupère l'id du div
      pix_list[data_recup] = 0;
      console.log(pix_list);
      colorCount()
      $('#oeuvre_tableau').val( JSON.stringify(pix_list) );
    }
  });
  
  $("#post_cont").on('mouseover', '.post_it', function(){
    var data_recup = 0;
    if ( click_mouseover == true){ // on attend le mousedown pour autoriser le pinceau en mouseover.
  
              if (gomme == false)
              {
                var pinceau = $(this).css('backgroundColor', color_div );
                data_recup = $(this).data("div_id") // on recupère l'id du div
                pix_list[data_recup] = rgb2hex(color_div); // on injecte la couleur dans le tableau
                $('#oeuvre_tableau').val( JSON.stringify(pix_list) );
                colorCount();
              }else{
                var pinceau = $(this).css({'backgroundColor':'rgba(255, 255, 255, 0.0)'});
                data_recup = $(this).data("div_id") // on recupère l'id du div
                pix_list[data_recup] = 0;
                colorCount()
                $('#oeuvre_tableau').val( JSON.stringify(pix_list) );
                colorCount();
          }}});
  
  
  $("#post_cont").on('mousedown', '.post_it', function(e){;
    e.preventDefault(); // On neutralise le drag and drop 
    click_mouseover = true; // On autorise le mouseover
  });
  
  $("#post_cont").on('mouseleave', '.post_it', function(){;
  });
  
  // Quand le bouton de la souris est relaché on desactive le mouseover
  $("body").on('mouseup', function(){;
    click_mouseover = false;
  });
  
  //Activation de la gomme
  
  $( "#gomme_btn" ).click(function() { 
    gomme = true;
  });
  
  //Activation du stylo
  $( "#stylo_btn" ).click(function() { 
    gomme = false;
    $('.color_selector_div').css('backgroundColor', color_div);
  });
  
  
  // La bombe à peinture
  
  $( "#remplir_btn" ).click(function() { 
    $(".post_it").css('backgroundColor', color_div ).css({ opacity: 1 });
    gomme = false;
    var k = -1;
    $.each(pix_list, function(key, element){
      pix_list[key] = rgb2hex(color_div);
    });
    colorCount()
    $('#oeuvre_tableau').val( JSON.stringify(pix_list) );
  });
  
  
  
  
  

  $("#addlineup_btn").click(function()
  {
  
   $('.post_it').remove(); // on nettoie les div  
   // Modif du tableau
   for (var i = 0; i < xchoice; i++)
   {
     pix_list.push(0);
     pix_list.shift();
     colorCount()
     $('#oeuvre_tableau').val( JSON.stringify(pix_list) );
   }
 
   // Lecture du tableau
   var k = -1;
         $.each( pix_list, function( key, j) {
           k++;
           if ( j == 0)
           {
             $('<div class="post_it" style="background-color : rgba(255, 255, 255, 0.0) "></div>').data("div_id", k).appendTo( "#post_cont" );// Le pixel est un Div de 15px/15
 
           }else{
             $('<div class="post_it"></div>').eq(0).css('backgroundColor', j ).data("div_id", k).appendTo( "#post_cont" );// Le pixel est un Div de 15px/15
 
           }
 
         });
       });


 $("#addlinedown_btn").click(function() {
 
  $('.post_it').remove(); // on nettoie les div  
  // Modif du tableau
  for (var i = 0; i < xchoice; i++)
  {
    pix_list.unshift(0);
    pix_list.pop();
    $('#oeuvre_tableau').val( JSON.stringify(pix_list) );
    colorCount();
  }

  // Lecture du tableau
  var k = -1;
        $.each( pix_list, function( key, j) {
          k++;
          if ( j == 0)
          {
            $('<div class="post_it" style="background-color : rgba(255, 255, 255, 0.0) "></div>').data("div_id", k).appendTo( "#post_cont" );// Le pixel est un Div de 25px/25

          }else{
            $('<div class="post_it"></div>').eq(0).css('backgroundColor', j ).data("div_id", k).appendTo( "#post_cont" );// Le pixel est un Div de 25px/25

          }

        });
      });
 
   
       
 
      //  Décalage X vers la droite
 
       $("#addcollumnleft_btn").click(function()
       {
         
        $('.post_it').remove(); // on nettoie les div  
        // Modif du tableau
       //  pix_list.splice(-1, 0, 0);
        pix_list.splice(xchoice * ychoice, 0, 0);
        pix_list.shift();
        colorCount()
        $('#oeuvre_tableau').val( JSON.stringify(pix_list) );
       //  pix_list.pop();
        // Lecture du tableau
        var k = -1;
              $.each( pix_list, function( key, j) {
                k++;
                if ( j == 0)
                {
                  $('<div class="post_it" style="background-color : rgba(255, 255, 255, 0.0) "></div>').data("div_id", k).appendTo( "#post_cont" );// Le pixel est un Div de 15px/15
       
                }else{
                  $('<div class="post_it"></div>').eq(0).css('backgroundColor', j ).data("div_id", k).appendTo( "#post_cont" );// Le pixel est un Div de 15px/15
       
                 }
               });
               
        });


 
        // Décalage X vers la droite
  
        $("#addcollumnright_btn").click(function()
        {
          
         $('.post_it').remove(); // on nettoie les div  
         // Modif du tableau
        //  pix_list.splice(-1, 0, 0);
         pix_list.splice(0, 0, 0);
         pix_list.pop();
         colorCount()
         $('#oeuvre_tableau').val( JSON.stringify(pix_list) );
        //  pix_list.pop();
         // Lecture du tableau
         var k = -1;
               $.each( pix_list, function( key, j) {
                 k++;
                 if ( j == 0)
                 {
                   $('<div class="post_it" style="background-color : rgba(255, 255, 255, 0.0) "></div>').data("div_id", k).appendTo( "#post_cont" );// Le pixel est un Div de 15px/15
        
                 }else{
                   $('<div class="post_it"></div>').eq(0).css('backgroundColor', j ).data("div_id", k).appendTo( "#post_cont" );// Le pixel est un Div de 15px/15
        
                 }
        });
        
               });
 
  $(function () {
    var header = $(".header");
    var logo = $(".logo");
    var siteTitle = $(".siteTitle");
    var mainPage = $(".mainPage");
    var headJumbo = $(".headJumbo");
    var articles = $(".articles");
    var rechercher = $(".rechercher");
    var editeur = $(".editeur");
    var headerTop = $(".headerTop");
    var headerFoot = $(".headerFoot");
    var guide = $(".guide");

    $(".main").scroll(function () {
      var scroll = $(".main").scrollTop();

      if (scroll >= 100) {
        header.removeClass('header').addClass("header2");
        logo.removeClass('logo').addClass("logo2");
        siteTitle.removeClass('siteTitle').addClass("siteTitle2");
        mainPage.removeClass('mainPage').addClass("mainPage2");
        headJumbo.removeClass('headJumbo').addClass("headJumbo2");
        articles.removeClass('articles').addClass("articles2");
        rechercher.removeClass('rechercher').addClass("rechercher2");
        editeur.removeClass('editeur').addClass("editeur2");
        headerTop.removeClass('headerTop').addClass("headerTop2");
        headerFoot.removeClass('headerFoot').addClass("headerFoot2");
        guide.removeClass('guide').addClass("guide2");

      } else {
        header.removeClass("header2").addClass('header');
        logo.removeClass("logo2").addClass('logo');
        siteTitle.removeClass('siteTitle2').addClass("siteTitle");
        mainPage.removeClass('mainPage2').addClass("mainPage");
        headJumbo.removeClass('headJumbo2').addClass("headJumbo");
        articles.removeClass('articles2').addClass("articles");
        rechercher.removeClass('rechercher2').addClass("rechercher");
        editeur.removeClass('editeur2').addClass("editeur");
        headerTop.removeClass('headerTop2').addClass("headerTop");
        headerFoot.removeClass('headerFoot2').addClass("headerFoot");
        guide.removeClass('guide2').addClass("guide");

      }
    });
  });
  
   });

