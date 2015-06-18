define(function() {
  var utils = {
    canPlayVideo: function( type ) {
      return document.createElement( 'video' ).canPlayType( 'video/' + type );
    },

    isIosDevice: function() {
      return /(iPad|iPhone|iPod)/g.test( navigator.userAgent );
    },

    loadImage: function( $image ) {
      var data = $image.data();

      /* only continue, if image has required data */
      if( !data || ( !data.src && !data.srcset ) ) {
        return;
      }

      $image
        .attr({
          src: data.src || undefined,
          srcset: data.srcset || undefined,
        });
    },
  };

  return utils;
});
