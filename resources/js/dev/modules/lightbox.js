define(
  [
    'jquery',
    'colorbox',
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
              lbOpenCallback = function() {
                require( [
                  'slick',
                  ], function() {
                  //FIXME: This currently returns the element, colorbox is associated with. Instead we must get the box-container here, which is wrapped around the content of the lightbox.
                  var $box = $.colorbox.element();

                  /* Initialize Slick */
                  $box.slick({
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

                var html = buildSlickHtml( $innerContainer );

                $.colorbox({
                  className: 'colorbox',
                  height: '60%',
                  html: html,
                  width: '60%',
                });

                $( document ).on( 'cbox_complete', lbOpenCallback );
              };

          /* Open Lightbox */
          $trigger.on( 'click', openLightbox );
        };

    return initLightbox;
  }
);
