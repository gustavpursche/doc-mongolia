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
              lbOpenCallback = function( e ) {
                require( [
                  'slick',
                  ], function() {
                  /* NOTE: There seems to be no way, to receive the lightbox through passed in arguments */
                  var $box = $( '#colorbox' );

                  /* activeElement can also be the <body/>, when clicking outside of the lightbox */
                  if( !$box.is( 'div' ) ) {
                    return;
                  }

                  /* Initialize Slick */
                  $box
                    .find( '.colorbox_slideshow' )
                      .slick({
                        fade: true,
                        infinite: true,
                        slidesToScroll: 1,
                        slidesToShow: 1,
                      });
                });
              },

              openLightbox = function( e ) {
                e.preventDefault();

                var lightboxOptions = {
                      /* Content */
                      html: buildSlickHtml( $innerContainer ),

                      /* Options */
                      className: 'colorbox',
                      closeButton: false,
                      fadeOut: 200,
                      height: '90%',
                      opacity: .4,
                      scalePhotos: false,
                      scrolling: false,
                      slideshow: false,
                      speed: 200,
                      transition: 'none',
                      width: '80%',

                      /* Callbacks */
                      onComplete: lbOpenCallback,
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
