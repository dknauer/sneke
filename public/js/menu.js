var menuOpen = false;

$( function(){
  $( '#menubtn' ).click( function(){
    if( menuOpen ){
      $( '#menu' ).animate( {'width': '0em'}, 180, function(){
        $( '#menuwrap' ).css( 'width', '0em' );
        $( '#menubtn>svg' ).css( 'fill', '#fdf6e3' );        
      });
      menuOpen = false;
    } else {
      $( '#menuwrap' ).css( 'width', '20em' );
      $( '#menubtn>svg' ).css( 'fill', '#cb4b16' );
      $( '#menu' ).animate( {'width': '20em'}, 180);
      menuOpen = true;
    }
  });
});