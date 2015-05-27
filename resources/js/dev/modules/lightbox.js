define(
  [
    'jquery',
  ],

  function( $ ) {
    var buildSlickHtml = function( $container ) {
          var $images = $container.find( '.figure' ),
              $list = $( '<div/>' )
                        .addClass( 'colorbox_slideshow' ),

              addListElement = function( index, el ) {
                var $listEl = $( '<div/>' ),
                    $image = $( this ).children( 'img' ).clone();

                $listEl.append( $image );
                $list.append( $listEl );
              };

          $.each( $images, addListElement );

          return $( '<div/>' ).append( $list ).html();
        },

        initLightbox = function( $container, options ) {
          var $innerContainer = $container.find( '.slow-scroll-col_enhance' ),
              openLightbox = function( e ) {
                e.preventDefault();

                var transitionSpeed = 150,
                    complete = function() {
                      require( [
                        'slick',
                        ], function() {

                        /* NOTE: There seems to be no way, to receive the lightbox through passed in arguments */
                        $( '#colorbox' )
                          .find( '.colorbox_slideshow' )
                            .slick({
                              fade: true,
                              infinite: true,
                              slidesToScroll: 1,
                              slidesToShow: 1,
                            });
                      });

                    },

                    lightboxOptions = {
                      /* Content */
                      html: buildSlickHtml( $innerContainer ),

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
                  $.colorbox( lightboxOptions );
                });

              };

          /* Open Lightbox */
          $innerContainer
            .on( 'click.lightbox',
                 '.figure_button',
                 openLightbox );
        };

    return initLightbox;
  }
);
