define([
  'jquery',
], function( $ ) {
  var init = function( $button ) {
    var activeClass = 'tooltip--active';

    var createTooltip = function( content ) {
          var $inner = $( '<div/>')
                          .addClass( 'tooltip_inner' )
                          .html( content ),
              $outer = $( '<div/>' )
                        .addClass( 'tooltip_outer' )
                        .append( $inner );

          return $outer;
        },

        getPosition = function( $trigger, $tooltip ) {
          var triggerOffset = $trigger.offset(),
              triggerLeft = triggerOffset.left,
              triggerTop = triggerOffset.top,
              triggerWidth = $trigger.outerWidth(),
              triggerHeight = $trigger.outerHeight(),

              tooltipHeight = $tooltip.outerHeight(),
              tooltipWidth = $tooltip.outerWidth(),

              tooltipLeft = ( triggerLeft - tooltipWidth ) + ( triggerWidth / 2 ),
              tooltipTop = ( triggerTop - ( triggerHeight / 2 ) ) - tooltipHeight;

          tooltipLeft += 30;
          tooltipTop -= 5;

          return {
            left: tooltipLeft,
            top: tooltipTop,
          };
        },

        hideTooltip = function( $trigger ) {
          var $instance = $trigger.data( 'tooltipinstance' );

          if( !$instance || !$instance.length || $trigger.data( 'locked' ) === true ) {
            return;
          }

          $instance.remove();

          $trigger
            .data({
              tooltipinstance: undefined,
            })
            .removeClass( activeClass );
        },

        showTooltip = function( $trigger ) {
          if( $trigger.data( 'tooltipinstance' ) ) {
            return;
          }

          var content = $trigger.children().html(),
              $skeleton = createTooltip( content );

          $skeleton
            .appendTo( 'body' )
            .css( getPosition( $trigger, $skeleton ) )
            .attr({
              tabindex: 0,
            })
            .focus();

          $trigger
            .data({
              tooltipinstance: $skeleton,
            })
            .addClass( activeClass );
        };

    $button
      .on( 'mouseenter.tooltip focus.tooltip', function( e ) {
        showTooltip( $( this ) );
      })
      .on( 'mouseleave.tooltip blur.tooltip', function( e ) {
        hideTooltip( $( this ) );
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
