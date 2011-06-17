# coffee --watch -o js/ --compile js/coffee/*.coffee

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
}

MAX_CHART_WIDTH_PERCENTAGE = 81

$(document).ready ->
  initChart()
  adjustFooter()
  populateDatasetOptions()
  observeDatasetOptions()
  getDataset 'twitter'

$(window).resize ->
  adjustFooter()

initChart = ->
  $('ol#chart li').each (index) ->
    $('<span></span>').appendTo $(@)
    $('<span class="digit">'+ (index + 1) + '</span>').prependTo $(@)
    $('<b>▲</b>').appendTo $(@)

placeBenfordMarkers = (multiplier) ->
  $('ol#chart li b').each (index) ->
    $(@).css('left', BENFORD_VALUES[index+1] * multiplier + '%')

adjustFooter = ->
  if $('section').css('float') is "none" and $('body').hasClass('single-column') is false
    $('footer').appendTo('body').show()
    $('body').addClass('single-column')
  else if $('section').css('float') isnt "none" and $('body').hasClass('single-column')
      $('footer').appendTo('aside')
      $('body').removeClass('single-column')

populateDatasetOptions = ->
  $.getJSON '/js/datasets/index.json', (data) ->
    items = []

    $.each data, (key, val) ->
      items.push '<option value="'+key+'">'+val+'</option>'

    $('#dataset-options').html(items.join(''))

observeDatasetOptions = ->
  $('#dataset-options').change ->
    getDataset $(@).val()

getDataset = (name) ->
  $.getJSON '/js/datasets/'+name+'.json', (data) ->
    # Set the chart description
    description = $('#dataset-options option:selected').text()

    # Default to grabbing the first one if nothing is "selected"
    if description.length == 0
      description = $('#dataset-options option:first').text()

    $('#dataset-description').text(description)

    multiplier = getMultiplierForDataset data

    # Populate the chart
    for num in [1..9]
      value = data.values[num]
      element = $('ol#chart li::nth-child('+num+') .fill')
      element.width(value * multiplier + '%')
      element.next('span').html(value+'%')

    # Update the data source
    $('#data-source').text(data.source)
    $('#data-source').attr('href', data.source)

    placeBenfordMarkers(multiplier)

getMultiplierForDataset = (dataset) ->
  max = 0
  $.each dataset.values, (key, val) ->
    max = val if val > max

  return MAX_CHART_WIDTH_PERCENTAGE/max

