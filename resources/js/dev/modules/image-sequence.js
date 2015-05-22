define(
  [
    'jquery',
    'ScrollMagic',
    'ScrollMagic-gsap',
  ],

  function( $, ScrollMagic ) {
    var init = function( $container ) {
      var imageSequence = new TimelineLite(),
          controller = controller = new ScrollMagic.Controller(),
          container = $container.get( 0 ),
          containerWidth = $container.outerWidth(),
          $images = $container.children( '.image-sequence_figure' ),
          fadeIn = TweenLite.fromTo( $container,
                                      1,
                                      {
                                        opacity: 0
                                      }, {
                                        opacity: 1
                                      } ),

          /* initialize the whole section */
          initSection = function( e ) {
            var $videos = $images.find( 'video' ),
                initializeVideo = function() {
                  var $video = $( this ),
                      media;

                  /* start preloading the video */
                  media = $video.get( 0 );
                  media.load();
                  media.play();
                };

            $.each( $videos, initializeVideo );
          },

          /* add animation to a single image */
          addImageAnimation = function() {
            var $figure = $( this ),
                $nextFigure = $figure.next( '.image-sequence_figure' ),
                $caption = $figure.children( '.image-sequence_caption' ),
                captionWidth = $caption.outerWidth(),
                imageAnimation = new TimelineLite(),
                captionLeft = ( containerWidth - captionWidth ) / 2,
                captionFadeTime = .8,
                imageFadeTime = 1.5,
                captionFadeIn = TweenLite.to( $caption,
                                              captionFadeTime,
                                              {
                                                opacity: 1,
                                              }, {
                                                ease: Power4.easeIn,
                                                y: 0
                                              } ),
                captionFadeOut = TweenLite.to( $caption,
                                               captionFadeTime,
                                                {
                                                  opacity: 0,
                                                }, {
                                                  ease: Power4.easeIn,
                                                  y: 0
                                                } ),
                imageFadeIn = TweenLite.fromTo( $nextFigure,
                                                imageFadeTime,
                                                {
                                                  opacity: 0,
                                                }, {
                                                  opacity: 1,
                                                }, {
                                                  ease: Power4.easeOut,
                                                  y: 0
                                                } ),
                imageFadeOut = TweenLite.to( $figure,
                                             imageFadeTime,
                                             {
                                               opacity: 0,
                                             }, {
                                               ease: Power4.easeOut,
                                               y: 0
                                             } );

            if( $caption.length ) {
              $caption.css({
                left: captionLeft,
              });

              imageAnimation
                .add( captionFadeIn );
            }

            /* Blend over images */
            if( $nextFigure.length ) {
              imageAnimation
                .add([
                  imageFadeOut,
                  imageFadeIn,
                ]);
            } else {
              /* FadeOut Caption */
              if( $caption.length ) {
                imageAnimation
                  .set( {}, {}, '.2' );

                imageAnimation
                  .add( captionFadeOut );
              }
            }

            imageSequence
              .add( imageAnimation );
          };

      $.each( $images, addImageAnimation );

      /* fadeIn the whole section */
      new ScrollMagic.Scene({
          triggerElement: container,
          triggerHook: 'onEnter',
          duration: '100%',
          offset: 150,
      }).setTween( fadeIn )
        .on( 'enter', initSection )
        .addTo( controller  );

      /* handle blend of sequence-elements */
      new ScrollMagic.Scene({
          triggerElement: container,
          triggerHook: 'onLeave',
          duration: '200%',
      }).setPin( container, { spacerClass: 'sm-image-sequencer' } )
        .setTween( imageSequence )
        .addTo( controller );
    };

    return init;
  }
);
