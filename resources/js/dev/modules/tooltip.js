define([
  'jquery',
], function( $ ) {
  var init = function( $button ) {
    var activeClass = 'tooltip--active';

    var createTooltip = function( title, content ) {
          var $close = $( '<button/>')
                        .addClass( 'tooltip_close' )
                        .append(
                          '<span class="icon icon--times-white"></span>' +
                          '<span class="u-is-accessible-hidden">Close</span>'
                         ),
              $title = $( '<strong>' )
                        .addClass( 'tooltip_title' )
                        .text( title ),
              $header = $( '<div/>')
                          .addClass( 'tooltip_header u-clearfix' )
                          .append( title ? $title : $() )
                          .append( $close ),
              $inner = $( '<div/>')
                          .addClass( 'tooltip_inner' )
                          .html( content ),
              $outer = $( '<div/>' )
                        .addClass( 'tooltip_outer' )
                        .append( $header )
                        .append( $inner );

          return $outer;
        },

        doPosition = function( $trigger, $tooltip ) {
          var triggerOffset = $trigger.offset(),
              triggerLeft = triggerOffset.left,
              triggerTop = triggerOffset.top,
              triggerWidth = $trigger.outerWidth(),
              triggerHeight = $trigger.outerHeight(),

              tooltipHeight = $tooltip.outerHeight(),
              tooltipWidth = $tooltip.outerWidth(),
              tooltipOrigWidth = tooltipWidth,

              tooltipLeft = ( triggerLeft - tooltipWidth ) + ( triggerWidth / 2 ),
              tooltipTop = triggerTop - tooltipHeight,

              offsetLeft = 30,
              offsetTop = 10,

              windowWidth,
              maxWidth,

              triggerHasLeftMoreSpaceThanRight = function() {
                var windowWidth = $( window ).width(),
                    triggerSpaceLeft = triggerLeft + ( triggerWidth / 2 ),
                    triggerSpaceRight = windowWidth - triggerSpaceLeft;

                return triggerSpaceLeft > triggerSpaceRight;
              };

          if( triggerHasLeftMoreSpaceThanRight() ) {
            $tooltip
              .css({
                left: ( triggerLeft + ( triggerWidth / 2 ) ) - tooltipWidth,
              })
              .addClass( 'tooltip_outer--right' );

            if( triggerLeft - tooltipWidth <= 0 ) {
              $tooltip
                .css({
                  width: Math.abs( triggerLeft - 10 ),
                });

              tooltipHeight = $tooltip.outerHeight();
              tooltipWidth = $tooltip.outerWidth();

              $tooltip
                .css({
                  top: triggerTop - tooltipHeight - offsetTop,
                  left: ( triggerLeft + ( triggerWidth / 2 ) ) - tooltipWidth,
                });
            } else {
              $tooltip
                .css({
                  top: tooltipTop - offsetTop,
                });
            }
          } else {
            tooltipLeft = ( triggerLeft + ( triggerWidth / 2 ) ) - offsetLeft;

            /* if it breaks the viewport to the right, make it smaller */
            windowWidth = $( window ).width();

            /* shrink the tooltip */
            if( tooltipLeft + tooltipWidth > windowWidth ) {
              $tooltip
                .css({
                  left: tooltipLeft,
                })
                .addClass( 'tooltip_outer--left' );

              maxWidth = tooltipWidth - (
                          (
                            tooltipLeft + tooltipWidth + offsetLeft
                            + 10 /* margin-right */
                          ) - windowWidth );

              $tooltip
                .css({
                  width: maxWidth,
                });

              tooltipHeight = $tooltip.outerHeight();
              tooltipTop = triggerTop - tooltipHeight - offsetTop;

              $tooltip
                .css({
                  top: tooltipTop,
                });
            } else {
              $tooltip
                .css({
                  left: tooltipLeft + offsetLeft,
                  top: tooltipTop - offsetTop,
                })
                .addClass( 'tooltip_outer--left' );
            }
          }
        },

        hideTooltip = function( $trigger, force ) {
          var $instance = $trigger.data( 'tooltipinstance' );

          if( !$instance || !$instance.length || $trigger.data( 'locked' ) === true ) {
            if( force !== true ) {
              return;
            }
          }

          $instance.remove();

          $trigger
            .data({
              tooltipinstance: undefined,
              locked: false,
            })
            .removeClass( activeClass );

          $( window )
            .off( '.tooltip' );
        },

        showTooltip = function( $trigger ) {
          if( $trigger.data( 'tooltipinstance' ) ) {
            return;
          }

          var content = $trigger.children().html(),
              $content = $( '<div/>' ).html( content ),
              title = $trigger.attr( 'title' ),
              $skeleton = createTooltip( title, content );

          if( $content.find( 'img' ).length ) {
            var $image = $content.find( 'img' ),
                src = $image.attr( 'src' ),
                srcset = $image.attr( 'srcset' ),
                image = new Image();

            image.src = src;
            image.srcset = srcset;

            $( image )
              .on( 'load', function() {
                $skeleton.appendTo( 'body' );
                doPosition( $trigger, $skeleton );
              });
          } else {
            $skeleton.appendTo( 'body' );
            doPosition( $trigger, $skeleton );
          }

          $skeleton
            .attr({
              tabindex: 0,
            })
            .focus()

            /* when entering with the mouse, don't close it */
            .on( 'mouseenter.tooltip', function() {
              $trigger.data( 'locked', true );
            })

            /* close button binding */
            .find( '.tooltip_close' )
              .on( 'click.tooltip', function( e ) {
                hideTooltip( $trigger, true );
              });

          $trigger
            .data({
              tooltipinstance: $skeleton,
            })
            .addClass( activeClass );

          setTimeout(function() {
            $( window )
              .on( 'click.tooltip keydown.tooltip', function( e ) {
                var $target = $( e.target ),
                    closest = [
                      '.tooltip',
                      '.tooltip_outer',
                    ];

                /* Ability to close Tooltip via ESC */
                if( e.type === 'keydown' && e.which === 27 ) {
                  hideTooltip( $trigger, true );
                  return;
                }

                /* Only close, if the interaction was outside of the tooltip */
                if( $target.closest( closest.join( ', ' ) ).length ) {
                  return;
                }

                hideTooltip( $trigger, true );
              });
          }, 10);
        };

    $button
      .on( 'mouseenter.tooltip focus.tooltip', function( e, data ) {
        showTooltip( $( this ) );
      })
      .on( 'mouseleave.tooltip blur.tooltip', function( e ) {
        var $this = $( this );

        setTimeout(function() {
          hideTooltip( $this );
        }, 200);
      })
      .on( 'click.tooltip', function( e ) {
        var $this = $( this );

        $this.data( 'locked', !$this.data( 'locked' ) );

        if( $this.data( 'tooltipinstance' ) ) {
          hideTooltip( $this );
        } else {
          showTooltip( $this );
        }
      });
  };

  return init;
});
