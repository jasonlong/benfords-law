(function() {
  var BENFORD_VALUES, MAX_CHART_WIDTH_PERCENTAGE, adjustFooter, drawChart, getDataset, getDefaultLocation, getLocation, getMultiplierForDataset, getOrdersOfMagnitudeBetween, initChart, initialURL, observeDatasetOptions, placeBenfordMarkers, popped, populateDatasetOptions, watchForPopState, zeroChart;
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
  MAX_CHART_WIDTH_PERCENTAGE = 81;
  popped = 'state' in window.history;
  initialURL = location.href;
  $(document).ready(function() {
    initChart();
    adjustFooter();
    return populateDatasetOptions();
  });
  $(window).resize(function() {
    return adjustFooter();
  });
  initChart = function() {
    return $('ol#chart li').each(function(index) {
      $('<span></span>').appendTo($(this));
      $('<span class="digit">' + (index + 1) + '</span>').prependTo($(this));
      return $('<b>▲</b>').hide().appendTo($(this));
    });
  };
  placeBenfordMarkers = function(multiplier) {
    return $('ol#chart li b').each(function(index) {
      return $(this).css('left', BENFORD_VALUES[index + 1] * multiplier + '%').fadeIn('fast');
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
  populateDatasetOptions = function() {
    return $.getJSON('/js/datasets/index.json', function(data) {
      var currentDataset, items;
      items = [];
      $.each(data, function(key, val) {
        return items.push('<option value="' + key + '">' + val + '</option>');
      });
      $('#dataset-options').html(items.join(''));
      currentDataset = getLocation();
      observeDatasetOptions();
      watchForPopState();
      $('#dataset-options').val(currentDataset);
      return zeroChart(currentDataset);
    });
  };
  observeDatasetOptions = function() {
    return $('#dataset-options').change(function() {
      var nextDataset;
      nextDataset = $(this).val();
      zeroChart(nextDataset);
      if (window.history && window.history.pushState) {
        return window.history.pushState({}, document.title, nextDataset);
      }
    });
  };
  watchForPopState = function() {
    if (window.history && window.history.pushState) {
      return $(window).bind('popstate', function(event) {
        var dataset, initialPop;
        initialPop = !popped && location.href === initialURL;
        popped = true;
        if (initialPop) {
          return;
        }
        dataset = getLocation();
        $('#dataset-options').val(dataset);
        return zeroChart(dataset);
      });
    }
  };
  getLocation = function(href) {
    var path;
    path = location.href.substring(location.href.lastIndexOf("/") + 1);
    if (path.length === 0) {
      path = getDefaultLocation();
    }
    return path;
  };
  getDefaultLocation = function() {
    return $('#dataset-options option:first').val();
  };
  zeroChart = function(nextDataset) {
    $('table#stats td:nth-child(2)').fadeOut('fast');
    $('#data-source').fadeOut('fast');
    return $('ol#chart li').each(function(index) {
      $(this).find('.fill').next('span').fadeOut('fast');
      $(this).find('b').fadeOut('fast');
      return $(this).find('.fill').animate({
        width: 0
      }, {
        duration: 400,
        complete: function() {
          if (index === 8) {
            return getDataset(nextDataset);
          }
        }
      });
    });
  };
  drawChart = function(data, multiplier) {
    return $('ol#chart li').each(function(index) {
      var value;
      value = data.values[index + 1];
      return $(this).find('.fill').animate({
        width: value * multiplier + '%'
      }, {
        duration: 400,
        complete: function() {
          $(this).next('span').html(value + '%');
          if (index === 8) {
            $('ol#chart li .fill').next('span').fadeIn('fast');
            $('table#stats td:nth-child(2)').fadeIn('fast');
            $('#data-source').fadeIn('fast');
            return placeBenfordMarkers(multiplier);
          }
        }
      });
    });
  };
  getDataset = function(name) {
    return $.getJSON('/js/datasets/' + name + '.json', function(data) {
      var description, multiplier;
      description = $('#dataset-options option:selected').text();
      if (description.length === 0) {
        description = $('#dataset-options option:first').text();
      }
      $('#dataset-description').text(description);
      multiplier = getMultiplierForDataset(data);
      $('#num-records').text(data.num_records);
      $('#min-value').text(data.min_value);
      $('#max-value').text(data.max_value);
      $('#orders-of-magnitude').text(getOrdersOfMagnitudeBetween(data.min_value, data.max_value));
      $('#data-source').text(data.source).attr('href', data.source);
      return drawChart(data, multiplier);
    });
  };
  getMultiplierForDataset = function(dataset) {
    var max;
    max = 0;
    $.each(dataset.values, function(key, val) {
      if (val > max) {
        return max = val;
      }
    });
    return MAX_CHART_WIDTH_PERCENTAGE / max;
  };
  getOrdersOfMagnitudeBetween = function(min, max) {
    min = parseInt(min.replace(/,/g, ""));
    max = parseInt(max.replace(/,/g, ""));
    return Math.floor(Math.LOG10E * Math.log(max - min));
  };
}).call(this);
