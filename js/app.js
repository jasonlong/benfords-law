(function() {
  var BENFORD_VALUES, adjustFooter, fillChart, placeBenfordMarkers;
  BENFORD_VALUES = {
    1: 30.1,
    2: 17.6,
    3: 12.5,
    4: 9.7,
    5: 7.9,
    6: 6.7,
    7: 5.8,
    8: 5.1,
    9: 4.6
  };
  $(document).ready(function() {
    adjustFooter();
    fillChart();
    return placeBenfordMarkers();
  });
  $(window).resize(function() {
    return adjustFooter();
  });
  fillChart = function() {
    return $('ol#chart li .fill').each(function(index) {
      var value;
      value = $(this).attr('data-value');
      $(this).width(value * 2 + '%');
      return $('<span>' + value + '%</span>').insertAfter($(this));
    });
  };
  placeBenfordMarkers = function() {
    return $('ol#chart li').each(function(index) {
      $('<span class="digit">' + (index + 1) + '</span>').prependTo($(this));
      return $('<b>▲</b>').css('left', BENFORD_VALUES[index + 1] * 2 + '%').appendTo($(this));
    });
  };
  adjustFooter = function() {
    if ($('section').css('float') === "none" && $('body').hasClass('single-column') === false) {
      $('footer').appendTo('body').show();
      return $('body').addClass('single-column');
    } else if ($('section').css('float') !== "none" && $('body').hasClass('single-column')) {
      $('footer').appendTo('aside');
      return $('body').removeClass('single-column');
    }
  };
}).call(this);
