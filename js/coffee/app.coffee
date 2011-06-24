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

# Used to detect initial (useless) popstate.
# If history.state exists, assume browser isn't going to fire initial popstate.
popped = ('state' of window.history)
initialURL = location.href

$(document).ready ->
  initChart()
  adjustFooter()
  populateDatasetOptions()

$(window).resize ->
  adjustFooter()

initChart = ->
  $('ol#chart li').each (index) ->
    $('<span></span>').appendTo $(@)
    $('<span class="digit">'+ (index + 1) + '</span>').prependTo $(@)
    $('<b>▲</b>').hide().appendTo $(@)

placeBenfordMarkers = (multiplier) ->
  $('ol#chart li b').each (index) ->
    $(@).css('left', BENFORD_VALUES[index+1] * multiplier + '%').fadeIn('fast')

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

    currentDataset = getLocation()

    observeDatasetOptions()
    watchForPopState()

    # Set the select menu to the correct value
    $('#dataset-options').val(currentDataset)

    # Draw the chart when the page first loads
    zeroChart(currentDataset)

observeDatasetOptions = ->
  $('#dataset-options').change ->
    nextDataset = $(@).val()

    # Draw the chosen dataset when the select menu changes
    zeroChart nextDataset

    # Use pushState to allow the back button to work
    if (window.history && window.history.pushState)
      window.history.pushState({}, document.title, nextDataset)

watchForPopState = ->
  # Make sure this browser supports HTML5 history
  if (window.history && window.history.pushState)
    $(window).bind 'popstate', (event) ->
      # Ignore inital popstate that some browsers fire on page load
      initialPop = !popped && location.href == initialURL
      popped = true
      return if initialPop

      dataset = getLocation()

      # Set the select menu to the correct value
      $('#dataset-options').val(dataset)

      # Draw the chart
      zeroChart dataset

getLocation = (href) ->
    path = location.href.substring(location.href.lastIndexOf("/")+1)
    # Get the default if there is no dataset in the path
    path = getDefaultLocation() if path.length == 0
    return path

getDefaultLocation = ->
  return $('#dataset-options option:first').val()

zeroChart = (nextDataset) ->
  $('table#stats td:nth-child(2)').fadeOut('fast')
  $('#data-source').fadeOut('fast')
  $('ol#chart li').each (index) ->
    $(@).find('.fill').next('span').fadeOut('fast')
    $(@).find('b').fadeOut('fast')
    $(@).find('.fill').animate({
      width: 0
    }, {
      duration: 400
      complete: ->
        getDataset nextDataset if index == 8
    })

drawChart = (data, multiplier) ->
  $('ol#chart li').each (index) ->
    value = data.values[index + 1]
    $(@).find('.fill').animate({
      width: value * multiplier + '%'
      }, {
      duration: 400
      complete: ->
        $(@).next('span').html(value+'%')
        if index == 8
          $('ol#chart li .fill').next('span').fadeIn('fast')
          $('table#stats td:nth-child(2)').fadeIn('fast')
          $('#data-source').fadeIn('fast')
          placeBenfordMarkers multiplier
    })

getDataset = (name) ->
  $.getJSON '/js/datasets/'+name+'.json', (data) ->
    # Set the chart description
    description = $('#dataset-options option:selected').text()

    # Default to grabbing the first one if nothing is "selected"
    if description.length == 0
      description = $('#dataset-options option:first').text()

    $('#dataset-description').text(description)

    multiplier = getMultiplierForDataset data

    # Update various stats
    $('#num-records').text(data.num_records)
    $('#min-value').text(data.min_value)
    $('#max-value').text(data.max_value)
    $('#orders-of-magnitude').text(getOrdersOfMagnitudeBetween(data.min_value, data.max_value))

    # Update the data source
    $('#data-source').text(data.source).attr('href', data.source)

    drawChart(data, multiplier)

getMultiplierForDataset = (dataset) ->
  max = 0
  $.each dataset.values, (key, val) ->
    max = val if val > max

  return MAX_CHART_WIDTH_PERCENTAGE/max

getOrdersOfMagnitudeBetween = (min, max) ->
  min = parseInt(min.replace(/,/g, ""))
  max = parseInt(max.replace(/,/g, ""))
  return Math.floor(Math.LOG10E * Math.log(max - min))
