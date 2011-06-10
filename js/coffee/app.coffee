# coffee --watch -o js/ --compile js/coffee/*.coffee

$(window).resize ->
  adjustFooter()

$(document).ready ->
  adjustFooter()
  fillChart()

fillChart = ->
  $('ol#chart li .fill').each (digit) ->
    value = $(this).attr('data-value')
    $(this).width(value*2 + '%')
    $('<span>'+value+'%</span>').insertAfter($(this))

adjustFooter = ->
  if $('section').css('float') is "none" and $('body').hasClass('single-column') is false
    $('footer').appendTo('body').show()
    $('body').addClass('single-column')
  else if $('section').css('float') isnt "none" and $('body').hasClass('single-column')
      $('footer').appendTo('aside')
      $('body').removeClass('single-column')
