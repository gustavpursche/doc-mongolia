var BOWER_BASE = '/bower_components/';

requirejs.config({
    baseUrl: '/resources/js/dev',
    paths: {
      jquery: BOWER_BASE + 'jquery/dist/jquery',
      modernizr: BOWER_BASE + 'modernizr/modernizr',
      modernizrvh: BOWER_BASE + 'modernizr/feature-detects/css-vhunit',
      modernizrvw: BOWER_BASE + 'modernizr/feature-detects/css-vwunit',
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
      modernizr: {
        exports: 'Modernizr',
      },
      modernizrvh: {
        deps: [ 'modernizr', ]
      },
      modernizrvw: {
        deps: [ 'modernizr', ]
      }
    },
});

require( [ 'webfontloader', ], function( WebFont ) {

  WebFont.load({
    classes: false,
    google: {
      families: [ 'Playfair+Display::latin' ],
    },
  });

});

require( [
  'jquery',
  'modernizr',
  'modernizrvh',
  'modernizrvw', ], function( $, Modernizr ) {
    var supportsVh = Modernizr.cssvhunit,
        supportsVw = Modernizr.cssvwunit;

    if( supportsVh && supportsVw ) {
      return;
    }

    $(function() {
      // bring elements on screen height/ screen width
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

