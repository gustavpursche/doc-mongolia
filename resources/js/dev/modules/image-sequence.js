define(
  [
    'jquery',
    'ScrollMagic',
    'ScrollMagic-gsap',
  ],

  function( $, ScrollMagic ) {
    var init = function( $container ) {
      var imageSequence = new TimelineLite(),
          container = $container.get( 0 ),
          $images = $container.children( '.image-sequence_figure' ),
          fadeIn = TweenLite.fromTo( $container, 1, { opacity: 0 }, { opacity: 1 } ),

          initSection = function( e ) {
            $.each( $images, function() {
              var $figure = $( this ),
                  $figureChild = $figure.children( 'img, video' ),
                  media;

              /* start preloading the video */
              if( $figureChild.is( 'video' ) ) {
                media = $figureChild.get( 0 );
                media.load();
                media.play();
              }
            });
          },

          addImageAnimation = function() {
            var $figure = $( this ),
                $figureChild = $figure.children( 'img, video' ).eq( 0 ),
                $nextFigure = $figure.next( '.image-sequence_figure' ),
                $caption = $figure.children( '.image-sequence_caption' ),
                imageAnimation = new TimelineLite(),
                captionLeft = ( $figure.parent().outerWidth() - $caption.outerWidth() ) / 2,
                captionFadeIn,
                captionFadeOut;

            if( $caption.length ) {
              $caption.css({
                left: captionLeft,
              });

              captionFadeIn = TweenLite.to( $caption,
                                            .8,
                                            {
                                              opacity: 1,
                                            } );

              captionFadeOut = TweenLite.to( $caption,
                                             .8,
                                              {
                                                opacity: 0,
                                              } );

              imageAnimation
                .add( captionFadeIn );

              imageAnimation
                .set( {}, {}, '+=.5' );

              imageAnimation
               .add( captionFadeOut );
            }

            /* Blend over images */
            if( $nextFigure.length ) {
              imageAnimation
                .add([
                  TweenLite.to( $figure,
                                1,
                                {
                                  opacity: 0,
                                } ),
                  TweenLite.fromTo( $nextFigure,
                                   1,
                                   {
                                    opacity: 0,
                                   }, {
                                    opacity: 1,
                                  } ),
                ]);
            }

            imageSequence
              .add( imageAnimation );
          };

      $.each( $images, addImageAnimation );

      new ScrollMagic.Scene({
          triggerElement: container,
          triggerHook: 'onEnter',
          duration: '100%',
          offset: 150,
      }).setTween( fadeIn )
        .addTo( new ScrollMagic.Controller() );

      new ScrollMagic.Scene({
          triggerElement: container,
          triggerHook: 'onLeave',
          duration: '200%',
      }).setPin( container, { spacerClass: 'sm-image-sequencer' } )
        .setTween( imageSequence )
        .on( 'enter', initSection )
        .addTo( new ScrollMagic.Controller() );
    };

    return init;
  }
);
