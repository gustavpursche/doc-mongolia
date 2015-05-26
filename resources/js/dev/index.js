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
      var updateVhElements = function() {
            var $window = $( window ),
                windowWidth = $window.width(),
                windowHeight = $window.height(),
                selectors = [
                  '.sm-image-sequencer .section',
                ],
                updateElement = function() {
                  $( this )
                    .css({
                      height: windowHeight,
                    })
                };

            $.each( selectors, updateElement );
          };

          updateVhElements();
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

        require( [ 'modules/' + module ], function( module ) {
          module( $section, options );
        });
      };

  $(function() {

    if( $( window ).width() < 1000 ) {
      return;
    }

    /* scrollmagic trigger */
    $.each( $( '.js--enhance' ), enhanceSection );
  });

});

/* Polyfill Area */
require( [
  'jquery',
  'utils',
  ],
  function( $, utils ) {
  $(function() {

    /* detect iOs devices to hide the header */
    if( !utils.isIosDevice() ) {
      return;
    }

    /* detect video capabilities */
    if( utils.canPlayVideo( 'mp4' ) ) {
      return;
    }

    $( '.header' ).addClass( 'header--no-video' );
    $( '.service' ).addClass( 'service--relative' );
  });

  /* play all videos, when the tweens are not applied */
  $(function() {
    if( $( window ).width() < 1000 ) {
      $.each( $( '.video' ), function() {
        this.play();
      });
    }
  });

});
