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
            var initializeVideo = function() {
                  var $video = $( this ),
                      played = !!$video.data( 'played' ),
                      media;

                  /* playback already started */
                  if( played ) {
                    return;
                  }

                  /* start preloading the video */
                  media = $video.get( 0 );
                  media.load();
                  media.play();

                  /* only initialize the Video once, instead of every scroll */
                  $video.data( 'played', true );
                };

            /* start load & play of every video in this section */
            $.each( $images.find( 'video' ), initializeVideo );
          },

          restoreSection = function( e ) {
            $container.find( '.figure_loader' ).remove();
          },

          /* add animation to a single image */
          addImageAnimation = function() {
            var $figure = $( this ),
                $nextFigure = $figure.next( '.image-sequence_figure' ),
                $caption = $figure.children( '.image-sequence_caption' ),
                captionWidth = $caption.outerWidth(),
                dataTo = $figure.data( 'to' ) || {},
                nextDataTo = $nextFigure.data( 'to' ) || {},
                defaultsTo = {
                  opacity: 0,
                },
                nextDefaultsTo = {
                  opacity: 1,
                }
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
                                                },
                                                $.extend( {}, nextDefaultsTo, nextDataTo ), {
                                                  ease: Power4.easeOut,
                                                  y: 0
                                                } ),
                imageFadeOut = TweenLite.to( $figure,
                                             imageFadeTime,
                                             $.extend( {}, defaultsTo, dataTo ), {
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

      /* Apply animation to every tsingle image */
      $.each( $images, addImageAnimation );

      /* fadeIn the whole section */
      new ScrollMagic.Scene({
          triggerElement: container,
          triggerHook: 'onEnter',
          duration: '100%',
          offset: 150,
      }).setTween( fadeIn )
        .on( 'enter', initSection )
        .on( 'leave', restoreSection )
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
