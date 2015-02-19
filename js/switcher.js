;(function($) {

"use strict";

// Variables
// ---------------------------------------------------------
var
// $body = $('body'),
// $head = $('head'),

$itemDemoIframe = $('.item-demo-iframe'),
$itemDemoContainer = $('.item-demo-wrapper'),
$productsToggleBtn = $('.items-toggle-btn'),
$viewports = $('.viewports'),
$carouselItems = $('.switcher-carousel .carousel-wrapper'),

hasPushState = !!(window.history && history.pushState);



// Get URL Parameters
// ---------------------------------------------------------
function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");

  for (var i=0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] === variable) { return pair[1]; }
  }

  return false;
}



// Current Item
// ---------------------------------------------------------
var $currentItem = getQueryVariable('item');

if (!($currentItem in $items) || $currentItem === '') {
  $currentItem = $defaultItem;
}



// Toggle Viewport Buttons
// ---------------------------------------------------------
function toggleViewportButtons() {
  if ('undefined' !== typeof $items[$currentItem].responsive && $items[$currentItem].responsive === false ) {
    $viewports.addClass('hidden');
  } else {
    $viewports.removeClass('hidden');
  }
}



// Remove Iframe
// ---------------------------------------------------------
$('.remove-frame-btn').on('click', function () {
  if ($currentItem in $items) {
    top.location.href = $items[$currentItem].url;
  }

  return false;
});



// Purchase Button
// ---------------------------------------------------------
$('.buy-now-btn').on('click', function () {
  if ($currentItem in $items) {
    top.location.href = $items[$currentItem].purchase;
  }

  return false;
});



// Carousel Toggle
// ---------------------------------------------------------
$productsToggleBtn.on('click', function (event) {
  event.preventDefault();

  $('.switcher-carousel').toggleClass('active');
});



// Viewport Buttons
// ---------------------------------------------------------
$viewports.each(function () {
  var $this = $(this);

  $this.on('click', 'li > a', function (event) {
    var $this = $(this),
        size = $this.data('size');

    event.preventDefault();

    if (size) {
      $itemDemoContainer.css('width', size);
      $this.parent('li').addClass('active').siblings('li').removeClass('active');
    }
  });
});



// Add Carousel Items
// ---------------------------------------------------------
$.each($items, function(key, object) {
  var tooltip;

  if ('tooltip' in object) {
    tooltip = 'title="' + object.tooltip.replace( /"/g, '\'' ) + '"';
  }

  $carouselItems.append(
    '<a class="item" data-id="' + key + '" ' + tooltip + '>' +
      '<img src="' + object.img + '" alt="' + object.name + '">' +
      '<span class="title">' + object.name + '</span>' +
      '<span class="badge">' + object.tag + '</span>' +
    '</a>'
  );
});



// Load demo function
// ---------------------------------------------------------
function loadItemDemo() {
  // Load Iframe
  $itemDemoIframe.attr('src', $items[$currentItem].url);

  // Set Document Title
  document.title = $items[$currentItem].name + ' ' + $items[$currentItem].tag + ' - ' + $('.switcher-bar .logo').attr('title');

  // Set current item title + tag
  $productsToggleBtn.html($items[$currentItem].name + '<span>' + $items[$currentItem].tag + '</span>');

  // Show/Hide Viewport Buttons
  toggleViewportButtons();
}



// On Load
// ---------------------------------------------------------
loadItemDemo();

$carouselItems.owlCarousel({
  items: 4,
  itemsTablet: [1199, 3],
  itemsTabletSmall: [991, 2],
  mouseDrag: false,
  pagination: false,
  navigation: true,
  navigationText: ['<i class="fa fa-chevron-left">', '<i class="fa fa-chevron-right">'],
  slideSpeed: 500,
  rewindNav: false
});



// Select Item from Carousel
// ---------------------------------------------------------
$carouselItems.find('.item').on('click', function () {
  $currentItem = $(this).data('id');

  if ($currentItem in $items) {
    if (hasPushState) {
      loadItemDemo();

      $itemDemoContainer.css('width', '100%');

      $('.switcher-carousel').removeClass('active');

      history.pushState({id: $currentItem}, '', '?item=' + $currentItem);
    } else {
      top.location.href = '?item=' + $currentItem;
    }
  }

  return false;
});

}(jQuery));
