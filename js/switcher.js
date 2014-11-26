;(function($) {

"use strict";

var $body = $('body');
var $head = $('head');
var hasPushState = !!(window.history && history.pushState);



// Mediaqueries
// ---------------------------------------------------------
// var XS = window.matchMedia('(max-width:767px)');
// var SM = window.matchMedia('(min-width:768px) and (max-width:991px)');
// var MD = window.matchMedia('(min-width:992px) and (max-width:1199px)');
// var LG = window.matchMedia('(min-width:1200px)');
// var XXS = window.matchMedia('(max-width:480px)');
// var SM_XS = window.matchMedia('(max-width:991px)');
// var LG_MD = window.matchMedia('(min-width:992px)');



// Touch
// ---------------------------------------------------------
var dragging = false;

$body.on('touchmove', function() {
  dragging = true;
});

$body.on('touchstart', function() {
  dragging = false;
});



// Get URL Parameters
// ---------------------------------------------------------
function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");

  for (var i=0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) { return pair[1]; }
  }

  return false;
}



// Current Item
// ---------------------------------------------------------
var $currentItem = getQueryVariable('item');

if (!($currentItem in $items) || $currentItem === '') {
  $currentItem = $defaultItem;
}



// Load Iframe
// ---------------------------------------------------------
var $itemDemoIframe = $('.item-demo-iframe');

$itemDemoIframe.attr('src', $items[$currentItem].url);

document.title = $items[$currentItem].name + ' ' + $items[$currentItem].tag + ' - ' + $('.switcher-bar .logo').attr('title');



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



// Viewport Buttons
// ---------------------------------------------------------
var $viewports = $('.viewports');

$viewports.each(function () {
  var $this = $(this);

  $this.find('li > a').on('click', function (event) {
    var $this = $(this),
        size = $this.data('size');

    event.preventDefault();

    if (size) {
      $itemDemoIframe.css('width', size);
      $this.parent('li').addClass('active').siblings('li').removeClass('active');
    }
  });
});



// Toggle Viewport Buttons
// ---------------------------------------------------------
function toggleViewportButtons() {

  if ('undefined' !== typeof $items[$currentItem].responsive && $items[$currentItem].responsive === false ) {
    $viewports.addClass('hidden');
  } else {
    $viewports.removeClass('hidden');
  }

}

toggleViewportButtons();



// Set Current Item Name
// ---------------------------------------------------------
var $productsToggleBtn = $('.items-toggle-btn');

$productsToggleBtn.html($items[$currentItem].name + '<span>' + $items[$currentItem].tag + '</span>');



// Add Carousel Items
// ---------------------------------------------------------
var $carouselItems = $('.switcher-carousel .carousel-wrapper'), tooltip;

$.each($items, function(key, object) {
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



// Load Carousel
// ---------------------------------------------------------
$carouselItems.cycle({
  slides: '> a',
  fx: 'carousel',
  timeout: 0,
  allowWrap: false,
  prev: '#switcher-carousel-prev',
  next: '#switcher-carousel-next'
});



// Carousel Toggle
// ---------------------------------------------------------
$productsToggleBtn.on('click', function (event) {
  event.preventDefault();

  $('.switcher-carousel').toggleClass('active');
});



// Select Item
// ---------------------------------------------------------
$carouselItems.find('.item').on('click', function () {
  $currentItem = $(this).data('id');

  if ($currentItem in $items) {
    if (hasPushState) {
      $itemDemoIframe.attr('src', $items[$currentItem].url);

      $('.switcher-carousel').removeClass('active');

      $productsToggleBtn.html($items[$currentItem].name + '<span>' + $items[$currentItem].tag + '</span>');

      window.history.pushState({id: $currentItem}, '', '?item=' + $currentItem);

      document.title = $items[$currentItem].name + ' ' + $items[$currentItem].tag + ' - ' + $('.switcher-bar .logo').attr('title');
    } else {
      window.location.href = '?item=' + $currentItem;
    }
  }

  return false;
});



// Reload history
// ---------------------------------------------------------
window.onpopstate = function(event) {
  if (event && event.state) {
    location.reload();
  }
}

}(jQuery));
