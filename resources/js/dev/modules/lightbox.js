define(
  [
    'jquery',
  ],

  function( $ ) {
    var buildSlideshowMarkup = function( $container ) {
          var $images = $container
                          .find( '.sidebar' )
                            .children( '.sidebar_figure' ),
              $wrap = $( '<div/>' )
                        .addClass( 'colorbox_slideshow' ),

              addListElement = function( index, el ) {
                var $child = $( '<div/>' ),
                    $image = $( this ).children( 'img' ).clone();

                $child.append( $image );
                $wrap.append( $child );
              };

          $.each( $images, addListElement );

          /* Return outerHtml of $wrap */
          return $( '<div/>' ).append( $list ).html();
        },

        init = function( $container, options ) {
          var $innerContainer = $container.find( '.slow-scroll-col_enhance' ),
              linkIndex,
              openLightbox = function( e ) {
                e.preventDefault();

                var $target = $( this ),
                    transitionSpeed = 150,
                    complete = function() {
                      require( [
                        'slick',
                        ], function() {

                        /* NOTE: There seems to be no way, to receive the lightbox through passed in arguments */
                        $( '#colorbox' )
                          .find( '.colorbox_slideshow' )
                            .slick({
                              initialSlide: linkIndex,
                              fade: true,
                              infinite: true,
                              slidesToScroll: 1,
                              slidesToShow: 1,
                            });

                      });

                    },

                    lightboxOptions = {
                      /* Content */
                      html: buildSlideshowMarkup( $innerContainer ),

                      /* Options */
                      className: 'colorbox',
                      closeButton: false,
                      fadeOut: transitionSpeed,
                      height: '90%',
                      opacity: .8,
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
                    .closest( '.slow-scroll-col_figure' ).index();
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
