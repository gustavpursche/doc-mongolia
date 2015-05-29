define(
  [
    'jquery',
    'ScrollMagic',
  ],

  function( $, ScrollMagic ) {
    var init = function( $container ) {
      var container = $container.get( 0 ),
          removeLodaer = function() {
            $container.find( '.header_loader' ).remove();
          };

      new ScrollMagic.Scene({
          triggerElement: container,
          triggerHook: 'onLeave',
          duration: '100%',
      }).on( 'leave', removeLodaer )
        .addTo( new ScrollMagic.Controller() );
    };

    return init;
  }
);
