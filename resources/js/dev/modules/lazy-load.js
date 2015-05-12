define( [ 'jquery', 'verge', ], function( $, verge ) {
  var lazyLoad = function( $els ) {
    var offset = 600;

    var checkElement = function() {
      var $el = $( this ),
          element = $el.get( 0 ),
          elType = 'image';

      if( $el.is( 'video' ) ) {
        elType = 'video';
      }

      switch( elType ) {
        case 'image':
          var lazyLoadImage = function( $target ) {
                var url = $target.data( 'lazysrc' );

                element.lazyloaded = true;

                if( !url ) {
                  return;
                }

                $target.attr({
                  src: url,
                });
              },
              $target = $el;

          if( $target.is( 'figure' ) ) {
            $target = $target.children( 'img' );
          }

          if( !element.lazyloaded && verge.inY( element, offset ) ) {
            lazyLoadImage( $target );
          }

          break;

        case 'video':
          var $sources = $el.children( 'source' ),
              lazyLoadVideo = function() {
                var $source = $( this ),
                    url = $source.data( 'lazysrc' );

                element.lazyloaded = true;

                if( !url ) {
                  return;
                }

                $source.attr({
                  src: url,
                });

                $el.load();
              }

          if( !element.lazyloaded && verge.inY( element, offset ) ) {
            $.each( $sources, lazyLoadVideo );
          }

          break;
      }
    };

    $.each( $els, checkElement );
  };

  return lazyLoad;
});
