var BOWER_BASE = '/bower_components/';

requirejs.config({
    baseUrl: '/resources/js/dev',
    paths: {
      jquery: BOWER_BASE + 'jquery/dist/jquery',
      ScrollMagic: BOWER_BASE + 'ScrollMagic/scrollmagic/uncompressed/ScrollMagic',
      'ScrollMagic-gsap': BOWER_BASE + 'ScrollMagic/scrollmagic/uncompressed/plugins/animation.gsap',
      TweenMax: BOWER_BASE + 'gsap/src/uncompressed/TweenMax',
      TimelineMax: BOWER_BASE + 'gsap/src/uncompressed/TimelineMax',
      webfontloader: BOWER_BASE + 'webfontloader/webfontloader',
    },

    shim: {
      verge: {
        exports: 'verge'
      },
      webfontloader: {
        exports: 'WebFont',
      },
    },
});

require( [ 'webfontloader' ], function( WebFont ) {

  WebFont.load({
    classes: false,
    google: {
      families: [ 'Playfair+Display::latin' ],
    },
  });

});

/* dynamically enhance some sections by defined modules */
require( [ 'jquery', ], function( $ ) {

  var enhanceSection = function( index, el ) {
        var $section = $( this ),
            data = $section.data(),
            module = data.module || undefined,
            options = data.options || undefined;

        if( !module ) {
          return;
        }

        if( $( window ).width() < 1000 ) {
          return;
        }

        require( [ 'modules/' + module ], function( module ) {
          module( $section, options );
        });
      };

  $(function() {
    /* scrollmagic trigger */
    $.each( $( '.js--enhance' ), enhanceSection );
  });

});

require( [ 'jquery', ], function( $ ) {

  $(function() {
    var $playlist = $( '.js--playlist' );

    require( [ 'modules/video-playlist' ], function( playlist ) {
      playlist( $playlist );
    } );
  })

});

