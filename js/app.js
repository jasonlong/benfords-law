(function() {
  var BENFORD_VALUES, adjustFooter, getDataset, initChart, placeBenfordMarkers, populateDatasetOptions;
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
    getDataset('twitter');
    placeBenfordMarkers();
    return $('#dataset-options').change(function() {
      return getDataset($(this).val());
    });
  });
  $(window).resize(function() {
    return adjustFooter();
  });
  initChart = function() {
    return $('ol#chart li').each(function(index) {
      $('<span></span>').appendTo($(this));
      return $('<span class="digit">' + (index + 1) + '</span>').prependTo($(this));
    });
  };
  placeBenfordMarkers = function() {
    return $('ol#chart li').each(function(index) {
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
  getDataset = function(name) {
    return $.getJSON('/js/datasets/' + name + '.json', function(data) {
      var description, element, num, value;
      description = $('#dataset-options option:selected').text();
      $('#dataset-description').text(description);
      for (num = 1; num <= 9; num++) {
        value = data[num];
        element = $('ol#chart li::nth-child(' + num + ') .fill');
        element.width(value * 2 + '%');
        element.next('span').html(value + '%');
      }
      $('#data-source').text(data.source);
      return $('#data-source').attr('href', data.source);
    });
  };
}).call(this);
