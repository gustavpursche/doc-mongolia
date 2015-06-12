module.exports = function( grunt ) {

  require( 'load-grunt-tasks' )( grunt );

  grunt.initConfig({
    aws: grunt.file.readJSON( 'aws.json' ),
    awsv: grunt.file.readJSON( 'aws_version.json' ),

    aws_s3: {
      options: {
        accessKeyId: '<%= aws.AccessKeyId %>',
        secretAccessKey: '<%= aws.SecretKey %>',
        region: 'eu-central-1',
        uploadConcurrency: 15,
        downloadConcurrency: 15,
        copyConcurrency: 15,
        signatureVersion: '<%= aws.signatureVersion %>',
      },
      dist: {
        options: {
          bucket: '<%= aws.bucket %>',
          differential: true
        },
        files: [
          {
            action: 'upload',
            expand: true,
            cwd: 'resources/js/dist/gzip',
            dest: '/mongolei/resources/js/dist/',
            src: [
              '*.js',
            ],
            stream: true,
            params: {
              ContentEncoding: 'gzip',
              ContentType: 'application/x-javascript',
            },
          },
          {
            action: 'upload',
            expand: true,
            cwd: 'resources/css/dist/gzip',
            dest: '/mongolei/resources/css/dist/',
            src: [
              '*.css',
            ],
            stream: true,
            params: {
              ContentEncoding: 'gzip',
              ContentType: 'text/css',
            },
          },
          {
            action: 'upload',
            expand: true,
            cwd: 'resources/icon/',
            dest: '/mongolei/resources/icon/',
            src: [
              '*.svg',
            ],
            stream: true,
            params: {
              ContentType: 'image/svg+xml',
            },
          },
          {
            action: 'upload',
            expand: true,
            cwd: 'de/dist/gzip',
            dest: '/mongolei/de/',
            src: [
              '*.html',
            ],
            stream: true,
            params: {
              ContentEncoding: 'gzip',
              ContentType: 'text/html; charset=utf-8'
            },
          }
        ]
      },
    },

    cloudfront: {
      options: {
        region: 'eu-central-1',
        distributionId: '<%= aws.cloudFrondDistribution %>',
        credentials: (function() {
          var aws = grunt.file.readJSON( 'aws.json' );

          return {
            accessKeyId: aws.AccessKeyId,
            secretAccessKey: aws.SecretKey,
          }
        }()),
        listInvalidations: true,
        listDistributions: false,
      },
      dist: {
        CallerReference: Date.now().toString(),
        Paths: {
          Quantity: 3,
          Items: [
            '/mongolei/de/index.html',
            '/mongolei/resources/js/dist/index.js',
            '/mongolei/resources/css/dist/main.css',
          ]
        }
      },
    },

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
          'bower_components/slick.js/slick/slick.css',
          'bower_components/slick.js/slick/slick-theme.css',
          'resources/css/dev/main.css',
        ],
        dest: 'resources/css/dist/main.css',
      },
    },

    compress: {
      html: {
        options: {
          mode: 'gzip',
          level: 9,
        },
        expand: true,
        cwd: 'de/dist',
        src: [
          '*.html',
        ],
        dest: 'de/dist/gzip',
      },
      js: {
        options: {
          mode: 'gzip',
          level: 9,
        },
        expand: true,
        cwd: 'resources/js/dist',
        src: [
          '*.js',
        ],
        dest: 'resources/js/dist/gzip',
      },
      css: {
        options: {
          mode: 'gzip',
          level: 9,
        },
        expand: true,
        cwd: 'resources/css/dist',
        src: [
          '*.css',
        ],
        dest: 'resources/css/dist/gzip',
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
          'resources/icon/arrow-left.svg': 'resources/icon/arrow-left.svg',
          'resources/icon/arrow-right.svg': 'resources/icon/arrow-right.svg',
          'resources/icon/earth.svg': 'resources/icon/earth.svg',
          'resources/icon/search-plus.svg': 'resources/icon/search-plus.svg',
          'resources/icon/sky.svg': 'resources/icon/sky.svg',
          'resources/icon/times.svg': 'resources/icon/times.svg',
          'resources/icon/tower.svg': 'resources/icon/tower.svg',
          'resources/icon/well.svg': 'resources/icon/well.svg',
          'resources/icon/cow.svg': 'resources/icon/cow.svg',

          'resources/logo/greenpeace-magazine-logo.svg': 'resources/logo/greenpeace-magazine-logo.svg',
        }
      }
    },

    jshint: {
      dist: {
        files: {
          src: [
            'resources/js/dev/**/*.js',
            'resources/js/dev/*.js',
          ]
        },
      },
    },

    replace: {
      js: {
        options: {
          prefix: '',
          patterns: [
            {
              match: /\<script data-main=\".*\"\>\<\/script\>/g,
              replacement: '<script src="' +
                           '{{url_prefix}}/resources/js/dist/index.js{{rv}}' +
                           '" type="text/javascript" async></script>',
            },
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

      jib_cdn: {
        options: {
          prefix: '',
          patterns: [
            {
              match: '{{url_prefix}}',
              replacement: 'https://cdn.jib-collective.net/mongolei',
            },
            {
              match: '{{v}}',
              replacement: '?v=<%= awsv.static_version %>',
            },
            {
              match: '{{rv}}',
              replacement: '?v=<%= awsv.resources_version %>',
            }
          ]
        },

        files: [
          {
            expand: true,
            flatten: true,
            src: [
              'de/dist/index.html',
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
            },
            {
              match: '{{v}}',
              replacement: '',
            },
            {
              match: '{{rv}}',
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
      }
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
            colorbox:           '../../../bower_components/jquery-colorbox/' +
                                'jquery.colorbox',
            jquery:             '../../../bower_components/jquery/dist/jquery',
            modernizr:          '../../../bower_components/modernizr/modernizr',
            modernizrvh:        '../../../bower_components/modernizr/' +
                                'feature-detects/css-vhunit',
            modernizrvw:        '../../../bower_components/modernizr/' +
                                'feature-detects/css-vwunit',
            almond:             '../../../bower_components/almond/almond',
            ScrollMagic:        '../../../bower_components/ScrollMagic/' +
                                'scrollmagic/uncompressed/ScrollMagic',
            'ScrollMagic-gsap': '../../../bower_components/ScrollMagic/' +
                                'scrollmagic/uncompressed/plugins/' +
                                'animation.gsap',
            TimelineLite:       '../../../bower_components/gsap/src/' +
                                'uncompressed/TimelineLite',
            TimelineMax:        '../../../bower_components/gsap/src/' +
                                'uncompressed/TimelineMax',
            TweenLite:          '../../../bower_components/gsap/src/' +
                                'uncompressed/TweenLite',
            TweenMax:           '../../../bower_components/gsap/src/' +
                                'uncompressed/TweenMax',
            slick:              '../../../bower_components/slick.js/slick/' +
                                'slick',
            webfontloader:      '../../../bower_components/webfontloader/'+
                                'webfontloader',
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

          include: [
            'almond',
            'colorbox',
            'jquery',
            'utils',
            'modernizrvh',
            'modernizrvw',
            'modules/header',
            'modules/image-sequence',
            'modules/lightbox',
            'modules/sidebar',
            'ScrollMagic-gsap',
            'slick',
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
      svg: {
        files: [
          'resources/icon/*.svg',
        ],
        tasks: [
          'svgmin:dist',
        ],
        options: {
          spawn: false,
          atBegin: true,
        },
      },
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
          atBegin: true,
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
          atBegin: true,
        }
      }
    },
  });

  grunt.registerTask( 'build', [
    'less',
    'concat',
    'cssmin',
    'svgmin:dist',
    'requirejs',
    'replace:js',
    'replace:jib_cdn',
    'htmlmin:dist',
    'compress',
  ]);

  grunt.registerTask( 'release', [
    'build',
    'aws_s3:dist',
    'cloudfront:dist',
  ]);

};
