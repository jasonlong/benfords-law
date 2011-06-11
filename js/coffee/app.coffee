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

$(document).ready ->
  adjustFooter()
  populateDatasetOptions()
  getDataset('twitter')
  placeBenfordMarkers()

  $('#dataset-options').change ->
    getDataset($(this).val())

$(window).resize ->
  adjustFooter()

placeBenfordMarkers = ->
  $('ol#chart li').each (index) ->
    $('<span class="digit">'+ (index + 1) + '</span>').prependTo $(@)
    $('<b>▲</b>').css('left', BENFORD_VALUES[index+1]*2 + '%').appendTo $(@)

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

getDataset = (name) ->
  $.getJSON '/js/datasets/'+name+'.json', (data) ->
    $.each data, (key, val) ->
      element = $('ol#chart li::nth-child('+key+') .fill')
      element.width(val*2 + '%')
      element.next('.percentage').html(val+'%')
