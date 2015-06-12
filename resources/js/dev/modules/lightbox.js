define(
  [
    'jquery',
  ],

  function( $ ) {
    var buildSlideshowMarkup = function( $container ) {
          var $images = $container
                          .find( '.sidebar_figure' ),
              $wrap = $( '<div/>' )
                        .addClass( 'colorbox_slideshow' ),

              addListElement = function( index, el ) {
                var $child = $( '<div/>' ),
                    $image = $( this ).children( 'img' ),
                    caption = $image.attr( 'alt' ),
                    $newImage = $( '<img/>' )
                                  .attr({
                                    src: $image.data( 'lightboxsrc' ),
                                    alt: caption || '',
                                  });

                $child.append( $newImage );

                if( caption ) {
                  $( '<p/>' )
                    .addClass( 'image_caption u-center-absolute-horizontal' )
                    .text( caption )
                    .appendTo( $child );
                }

                $wrap.append( $child );
              };

          $.each( $images, addListElement );

          /* Return outerHtml of $wrap */
          return $( '<div/>' ).append( $wrap ).html();
        },

        init = function( $container, options ) {
          var $innerContainer = $container.find( '.sidebar' ),
              linkIndex,
              openLightbox = function( e ) {
                e.preventDefault();

                var $target = $( this ),
                    transitionSpeed = 150,
                    complete = function() {
                      var fixCloseButton = function() {
                          var $btn = $( '#cboxClose' ),
                              btnText = $btn.text(),
                              $text = $( '<span/>' )
                                        .addClass( 'u-is-accessible-hidden')
                                        .text( btnText );

                          $btn
                            .addClass( 'icon icon--times' )
                            .text( '' )
                            .append( $text );
                        };

                      require( [
                        'slick',
                        ], function() {

                        /* NOTE: There seems to be no way, to receive the lightbox through passed in arguments */
                        $( '#colorbox' )
                          .find( '.colorbox_slideshow' )
                            .slick({
                              adaptiveHeight: true,
                              initialSlide: linkIndex,
                              fade: true,
                              infinite: true,
                              slidesToScroll: 1,
                              slidesToShow: 1,
                            });

                      });

                      /* Markup Fixes */
                      fixCloseButton();
                    },

                    lightboxOptions = {
                      /* Content */
                      html: buildSlideshowMarkup( $innerContainer ),

                      /* Options */
                      className: 'colorbox',
                      fadeOut: transitionSpeed,
                      height: '90%',
                      maxWidth: '100%',
                      opacity: 0.85,
                      scalePhotos: false,
                      scrolling: false,
                      slideshow: false,
                      speed: transitionSpeed,
                      transition: 'none',
                      width: '80%',

                      /* Callbacks */
                      onComplete: complete,
                    };

                require( [
                  'colorbox',
                  ], function() {
                  linkIndex = $target
                    .closest( '.sidebar_figure' ).index();
                  $.colorbox( lightboxOptions );
                });

              };

          /* Open Lightbox */
          $innerContainer
            .on( 'click.lightbox',
                 '.figure_button',
                 openLightbox );
        };

    return init;
  }
);
