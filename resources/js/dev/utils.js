define(function() {
  var utils = {
    canPlayVideo: function( type ) {
      return document.createElement( 'video' ).canPlayType( 'video/' + type );
    },

    isIosDevice: function() {
      return /(iPad|iPhone|iPod)/g.test( navigator.userAgent );
    },
  };

  return utils;
});
