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
          backgroundTween = TweenLite.to( $container,
                                         0,
                                         {
                                          'background-color': 'black',
                                         }
                            ),
          preloadMediaAndCenter = function( e ) {
            var containerHeight = $container.outerHeight();

            $.each( $images, function() {
              var $figure = $( this ),
                  $figureChild = $figure.children(),
                  isVideo = $figureChild.is( 'video' ),
                  media,
                  figureHeight = $figureChild.outerHeight();

              if( isVideo ) {
                media = $figureChild.get( 0 );
                media.load();
                media.play();

                $figure
                  .css( 'top', ( containerHeight - figureHeight ) / 2 );
              }
            });
          },

          addImageAnimation = function() {
            var $figure = $( this ),
                $figureChild = $figure.children(),
                isVideo = $figureChild.is( 'video' ),
                $nextFigure = $figure.next( '.image-sequence_figure' ),
                $caption = $figure.children( '.image-sequence_caption' ),
                captionOptionsFrom = $caption.data( 'optionsfrom' ),
                captionOptionsTo = $caption.data( 'optionsto' ),
                imageAnimation = new TimelineLite(),
                imageHeight = $figure.height(),
                captionAnimation,
                captionFadeIn,
                parallaxImage = TweenLite.to( $figure,
                                             .6,
                                             {
                                               top: '-=5%',
                                             }
                                );

            if( isVideo ) {
              parallaxImage  = undefined;
            }

            if( !captionOptionsTo ) {
              captionOptionsTo = {
                top: - $caption.outerHeight(),
              };
            }

            if( $caption.length ) {
              captionFadeIn = TweenLite.to( $caption,
                                            .2,
                                            {
                                              opacity: 1,
                                            } );
              captionAnimation = TweenLite.to( $caption,
                                               1.2,
                                               captionOptionsTo );

              if( isVideo ) {
                imageAnimation
                  .add([
                    captionFadeIn,
                    captionAnimation
                  ]);
              } else {
                imageAnimation
                  .add([
                    captionFadeIn,
                    parallaxImage,
                    captionAnimation,
                  ]);
              }
            }

            /* Blend over images */
            if( $nextFigure.length ) {
              imageAnimation
                .add([
                  TweenLite.to( $figure,
                                .6,
                                {
                                  opacity: .3,
                                  display: 'none',
                                } ),
                  TweenLite.fromTo( $nextFigure,
                                   .6,
                                   {
                                    opacity: 0,
                                    display: 'none',
                                   }, {
                                    opacity: 1,
                                    display: 'block',
                                  } ),
                ]);
            }

            imageSequence
              .add( imageAnimation );
          };

      /* Transition background color */
      imageSequence
        .add( backgroundTween );

      /* Create o,age tramsition */
      $.each( $images, addImageAnimation );

      /* Revert to original state */
      imageSequence
        .add( backgroundTween.reverse() );

      new ScrollMagic.Scene({
          triggerElement: container,
          triggerHook: 'onLeave',
          duration: '250%',
      }).setPin( container, { spacerClass: 'sm-image-sequencer' } )
        .setTween( imageSequence )
        .on( 'enter', preloadMediaAndCenter )
        .addTo( new ScrollMagic.Controller() );
    };

    return init;
  }
);
