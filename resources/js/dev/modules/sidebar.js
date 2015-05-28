define(
  [
    'jquery',
    'ScrollMagic',
    'ScrollMagic-gsap',
  ],

  function( $, ScrollMagic ) {
    var init = function( $container ) {
      var container = $container.get( 0 ),
          controller = new ScrollMagic.Controller(),
          $slowCol = $container.find( '.sidebar' ),
          fadeIn = TweenLite.fromTo( $slowCol,
                                     1,
                                     {
                                       opacity: 0,
                                      }, {
                                       opacity: 1,
                                      } ),
          fadeOut = TweenLite.fromTo( $slowCol,
                                      1,
                                      {
                                        opacity: 1,
                                      }, {
                                        opacity: 0,
                                      } );

      new ScrollMagic.Scene({
          triggerElement: $slowCol.get( 0 ),
          triggerHook: 'onEnter',
          duration: '100%',
      }).setTween( fadeIn )
        .addTo( controller );

      new ScrollMagic.Scene({
          triggerElement: container,
          triggerHook: 'onEnter',
          duration: '100%',
          offset: $container.outerHeight(),
      }).setTween( fadeOut )
        .addTo( controller );
    };

    return init;
  }
);
