(function() {
  var BENFORD_VALUES, adjustFooter, getDataset, getMultiplierForDataset, initChart, observeDatasetOptions, placeBenfordMarkers, populateDatasetOptions;
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
    initChart();
    adjustFooter();
    populateDatasetOptions();
    observeDatasetOptions();
    return getDataset('twitter');
  });
  $(window).resize(function() {
    return adjustFooter();
  });
  initChart = function() {
    return $('ol#chart li').each(function(index) {
      $('<span></span>').appendTo($(this));
      $('<span class="digit">' + (index + 1) + '</span>').prependTo($(this));
      return $('<b>▲</b>').appendTo($(this));
    });
  };
  placeBenfordMarkers = function(multiplier) {
    return $('ol#chart li b').each(function(index) {
      return $(this).css('left', BENFORD_VALUES[index + 1] * multiplier + '%');
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
      var items;
      items = [];
      $.each(data, function(key, val) {
        return items.push('<option value="' + key + '">' + val + '</option>');
      });
      return $('#dataset-options').html(items.join(''));
    });
  };
  observeDatasetOptions = function() {
    return $('#dataset-options').change(function() {
      return getDataset($(this).val());
    });
  };
  getDataset = function(name) {
    return $.getJSON('/js/datasets/' + name + '.json', function(data) {
      var description, element, multiplier, num, value;
      description = $('#dataset-options option:selected').text();
      if (description.length === 0) {
        description = $('#dataset-options option:first').text();
      }
      $('#dataset-description').text(description);
      multiplier = getMultiplierForDataset(data);
      for (num = 1; num <= 9; num++) {
        value = data.values[num];
        element = $('ol#chart li::nth-child(' + num + ') .fill');
        element.width(value * multiplier + '%');
        element.next('span').html(value + '%');
      }
      $('#data-source').text(data.source);
      $('#data-source').attr('href', data.source);
      return placeBenfordMarkers(multiplier);
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
    return 85 / max;
  };
}).call(this);
