(function() {
  var adjustFooter, fillChart;
  $(window).resize(function() {
    return adjustFooter();
  });
  $(document).ready(function() {
    adjustFooter();
    return fillChart();
  });
  fillChart = function() {
    return $('ol#chart li .fill').each(function(digit) {
      var value;
      value = $(this).attr('data-value');
      $(this).width(value * 2 + '%');
      return $('<span>' + value + '%</span>').insertAfter($(this));
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
