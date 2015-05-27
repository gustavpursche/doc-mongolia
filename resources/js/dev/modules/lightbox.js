define(
  [
    'jquery',
  ],

  function( $ ) {
    var buildSlickHtml = function( $container ) {
          var $images = $container.find( '.figure' ),
              $list = $( '<ul/>' )
                        .addClass( 'colorbox_slideshow' ),

              addListElement = function( index, el ) {
                var $listEl = $( '<li/>' ),
                    $image = $( this ).children( 'img' ).clone();

                $listEl.append( $image );

                $list.append( $listEl );
              };

          $.each( $images, addListElement );

          return $( '<div/>' ).append( $list ).html();
        },

        initLightbox = function( $container, options ) {
          var $innerContainer = $container.find( '.slow-scroll-col_enhance'),
              $trigger = $innerContainer.find( '.figure_button' ),
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
                        slide: 'li',
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
                      height: '95%',
                      opacity: .75,
                      scalePhotos: false,
                      scrolling: false,
                      slideshow: false,
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
          $trigger.on( 'click', openLightbox );
        };

    return initLightbox;
  }
);
