module.exports = function( grunt ) {

  require( 'load-grunt-tasks' )( grunt );

  grunt.initConfig({
    less: {
      development: {
        options: {
          ieCompat: false,
        },
        files: {
          'resources/css/dev/main.css': 'less/index.less',
        },
      },
    },

    concat: {
      dist: {
        src: [
          'bower_components/normalize.css/normalize.css',
          'resources/css/dev/main.css',
        ],
        dest: 'resources/css/dist/main.css',
      },
    },

    cssmin: {
      options: {
        keepSpecialComments: false,
      },

      dist: {
        files: {
          'resources/css/dist/main.css': 'resources/css/dist/main.css',
        },
      },
    },

    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          removeAttributeQuotes: true,
          removeRedundantAttributes: true,
          collapseWhitespace: true,
          preserveLineBreaks: true,
        },
        files: {
          'de/dist/index.html': 'de/dist/index.html',
        }
      },
    },

    svgmin: {
      options: {
        plugins: [
          {
              removeViewBox: false
          }, {
              removeUselessStrokeAndFill: false
          }
        ]
      },
      dist: {
        files: {
          'resources/icon/earth.svg': 'resources/icon/earth.svg',
          'resources/icon/sky.svg': 'resources/icon/sky.svg',
          'resources/icon/well.svg': 'resources/icon/well.svg',
          'resources/icon/tower.svg': 'resources/icon/tower.svg',
        }
      }
    },

    replace: {
      dist: {
        options: {
          prefix: '',
          patterns: [
            {
              match: /\<script data-main=\".*\"\>\<\/script\>/g,
              replacement: '',
            },
            {
              match: '"{{js_inline}}";',
              replacement: function() {
                var fs = require( 'fs' );

                var data = fs.readFileSync( './resources/js/dist/index.js' );
                return data.toString();
              },
            },
            {
              match: /\<link .* href=\".*main.css\" \/>/g,
              replacement: '',
            },
            {
              match: '{{css_inline}}',
              replacement: function() {
                var fs = require( 'fs' );

                var data = fs.readFileSync( './resources/css/dist/main.css' );
                return data.toString();
              },
            },
            {
              match: '{{url_prefix}}',
              replacement: 'https://cdn.jib-collective.net/mongolei',
            }
          ]
        },

        files: [
          {
            expand: true,
            flatten: true,
            src: [
              'de/dev/index.html',
            ],
            dest: 'de/dist/',
          },
        ],
      },

      dev: {
        options: {
          prefix: '',
          patterns: [
            {
              match: '{{url_prefix}}',
              replacement: '',
            }
          ]
        },

        files: [
          {
            expand: true,
            flatten: true,
            src: [
              'de/dev/index.html',
            ],
            dest: 'de/dist/',
          },
        ],
      },
    },

    requirejs: {
      dist: {
        options: {
          baseUrl: './resources/js/dev/',
          name: 'index',
          out: 'resources/js/dist/index.js',
          optimize: 'uglify2',
          preserveLicenseComments: false,
          paths: {
            jquery:             '../../../bower_components/jquery/dist/jquery',
            modernizr:          '../../../bower_components/modernizr/modernizr',
            modernizrvh:        '../../../bower_components/modernizr/feature-detects/css-vhunit',
            modernizrvw:        '../../../bower_components/modernizr/feature-detects/css-vwunit',
            almond:             '../../../bower_components/almond/almond',
            ScrollMagic:        '../../../bower_components/ScrollMagic/' +
                                'scrollmagic/uncompressed/ScrollMagic',
            'ScrollMagic-gsap': '../../../bower_components/ScrollMagic/' +
                                'scrollmagic/uncompressed/plugins/animation.gsap',
            TimelineLite:       '../../../bower_components/gsap/src/' +
                                'uncompressed/TimelineLite',
            TimelineMax:        '../../../bower_components/gsap/src/' +
                                'uncompressed/TimelineMax',
            TweenLite:          '../../../bower_components/gsap/src/' +
                                'uncompressed/TweenLite',
            TweenMax:           '../../../bower_components/gsap/src/' +
                                'uncompressed/TweenMax',
            webfontloader:      '../../../bower_components/webfontloader/'+
                                'webfontloader',
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

          include: [
            'almond',
            'jquery',
            'modernizrvh',
            'modernizrvw',
            'modules/fadeout',
            'modules/image-sequence',
            'modules/slow-scroll-col',
            'ScrollMagic-gsap',
            'webfontloader',
          ],
          uglify2: {
            output: {
              beautify: false,
            },
          }
        },
      },
    },

    watch: {
      resources: {
        files: [
          'less/*.less',
        ],
        tasks: [
          'less',
          'concat',
        ],
        options: {
          spawn: false,
        },
      },
      html: {
        files: [
          'de/dev/index.html',
        ],
        tasks: [
          'replace:dev',
        ],
        options: {
          spawn: false,
        }
      }
    },
  });

  grunt.registerTask( 'build', [
    'less',
    'concat',
    'cssmin',
    'requirejs',
    'replace:dist',
    'htmlmin:dist',
  ]);

};