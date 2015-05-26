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
      webfontloader: BOWER_BASE + 'webfontloader/webfontloader',
    },

    shim: {
      colorbox: {
        deps: [ 'jquery', ],
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
      },
      slick: {
        depts: [ 'jquery', ],
      },
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

require( [
    'jquery',
    'colorbox',
    ], function( $ ) {
  var buildSlickHtml = function( $container ) {
        var $images = $container.find( '.figure' ),
            $list = $( '<ul/>' ),

            addListElement = function( index, el ) {
              var $listEl = $( '<li/>' ),
                  $image = $( this ).children( 'img' ).clone();

              $listEl.append( $image );

              $list.append( $listEl );
            };

        $.each( $images, addListElement );

        return $( '<div/>' ).append( $list ).html();
      },

      initLightbox = function( $container ) {
        var $trigger = $container.find( '.figure_button' ),
            lbOpenCallback = function() {

              console.log('lightbox open')

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

              var html = buildSlickHtml( $container );

              $.colorbox({
                height: '60%',
                html: html,
                width: '60%',
              });

              $( document ).on( 'cbox_complete', lbOpenCallback );
            };

        /* Open Lightbox */
        $trigger.on( 'click', openLightbox );
      };

  $.each( $( '.slow-scroll-col' ), function( index, el ) {
    initLightbox( $( el ) );
  });

});
