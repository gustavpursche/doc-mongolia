define(
  [
    'jquery',
    'ScrollMagic',
    'ScrollMagic-gsap',
  ],

  function( $, ScrollMagic ) {
    var init = function( $container ) {
      var container = $container.get( 0 ),
          tweenTarget = {
            opacity: .2,
          }
          fadeOut = TweenLite.to( container, 1, tweenTarget );

      new ScrollMagic.Scene({
          triggerElement: container,
          triggerHook: 'onLeave',
          duration: '150%',
      }).setTween( fadeOut )
        .addTo( new ScrollMagic.Controller() );
    };

    return init;
  }
);
