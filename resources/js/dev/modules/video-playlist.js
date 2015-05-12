define(
  [
    'jquery',
  ],
  function( $ ) {
    var init = function( $container ) {
      var $source = $container.children( 'source' ),
          playlist = $container.data( 'playlist' ),
          videos = {};

      /* currently played video */
      videos[ $source.attr( 'src' ) ] = true;

      $.each( playlist, function( index, url ) {
        videos[ url ] = false;
      } );

      $container.on( 'ended', function() {
        var endedUrl = $source.attr( 'src' ),
            enableNext = false;

        $.each( videos, function( index, played ) {
          if( enableNext ) {
            videos[ index ] = true;
            enableNext = false;

            $source.attr( 'src', index );
            $container.load();
          }

          if( index === endedUrl ) {
            videos[ endedUrl ] = false;
            enableNext = true;
          }
        } );
      });
    };

    return init;
  }
);
