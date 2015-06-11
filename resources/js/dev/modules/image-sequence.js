define(
  [
    'jquery',
    'utils',
    'ScrollMagic',
    'ScrollMagic-gsap',
  ],

  function( $, utils, ScrollMagic ) {
    var init = function( $container ) {
      var imageSequence = new TimelineLite(),
          controller = new ScrollMagic.Controller(),
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
                },

                loadImage = function() {
                  utils.loadImage( $( this ).children( 'img' ) );
                };

            /* start load & play of every video in this section */
            $.each( $images.find( 'video' ), initializeVideo );

            /* lazy loading of images */
            $.each( $images, loadImage );
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
                },
                imageAnimation = new TimelineLite(),
                captionFadeTime = 0.8,
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
                captionMoveUp = TweenLite.to( $caption,
                                              1.5,
                                              {
                                                bottom: '80%',
                                              }, {
                                                ease: Power4.easeOut,
                                              }),
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
                                               y: 0,
                                             } );

            if( $caption.length ) {
              imageAnimation
                .add( captionFadeIn )
                .add( captionMoveUp )
                .add( captionFadeOut );
            }

            /* Blend over images */
            if( $nextFigure.length ) {
              imageAnimation
                .add([
                  imageFadeOut,
                  imageFadeIn,
                ]);
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
