var BOWER_BASE = '/bower_components/';

requirejs.config({
    baseUrl: '/resources/js/dev',
    paths: {
      colorbox: BOWER_BASE + 'jquery-colorbox/jquery.colorbox',
      jquery: BOWER_BASE + 'jquery/dist/jquery',
      modernizr: BOWER_BASE + 'modernizr/modernizr',
      modernizrvh: BOWER_BASE + 'modernizr/feature-detects/css-vhunit',
      modernizrvw: BOWER_BASE + 'modernizr/feature-detects/css-vwunit',
      ScrollMagic: BOWER_BASE + 'ScrollMagic/scrollmagic/uncompressed/ScrollMagic',
      'ScrollMagic-gsap': BOWER_BASE + 'ScrollMagic/scrollmagic/uncompressed/plugins/animation.gsap',
      TweenLite: BOWER_BASE + 'gsap/src/uncompressed/TweenLite',
      TweenMax: BOWER_BASE + 'gsap/src/uncompressed/TweenMax',
      TimelineMax: BOWER_BASE + 'gsap/src/uncompressed/TimelineMax',
      slick: BOWER_BASE + 'slick.js/slick/slick',
    },

    shim: {
      colorbox: {
        deps: [ 'jquery', ],
      },
      modernizr: {
        exports: 'Modernizr',
      },
      modernizrvh: {
        deps: [ 'modernizr', ]
      },
      modernizrvw: {
        deps: [ 'modernizr', ]
      },
      slick: {
        depts: [ 'jquery', ],
      },
    },
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
                    });
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
            options = data.options || undefined,
            alwaysAllowed = [
              'tooltip',
            ];

        if( !module ) {
          return;
        }

        $.each( module.split(','), function loadModule( index, localModule ) {

          /* allow certain modules on all screens */
          if( alwaysAllowed.indexOf( localModule ) === -1 ) {
            if( $( window ).width() < 1000 ) {
              return;
            }
          }

          require( [ 'modules/' + localModule ], function( localModule ) {
            localModule( $section, options );
          });
        });

      };

  $(function() {
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

    var adoptHeader = function() {
      var $header = $( '.header' ),
          $fallbackImage = $header.children( '.header_fallback-image' );

      $header.addClass( 'header--no-video' );
      utils.loadImage( $fallbackImage.children( 'img' ) );
    };

  $(function() {

    /* detect iOs devices and video capabilities to hide the header */
    if( utils.canPlayVideo( 'mp4' ) || !utils.isIosDevice() ) {
      return;
    }

    adoptHeader();

    /*
    NOTE: Don't need this, until the service navigation was added back
    $( '.service' ).addClass( 'service--relative' );
    */
  });

/* Tweens were not applied - this is the minimal JS, which will be executed
   then */
  $(function() {
    if( $( window ).width() >= 1000 ) {
      return;
    }

    /* play all videos, when the tweens are not applied */
    $.each( $( 'video' ), function() {
      this.play();
    });

    /* lazyload images */
    $.each( $( '.js--lazyload' ), function() {
      utils.loadImage( $( this ) );
    });

  });
});
