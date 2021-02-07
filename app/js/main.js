$(function() {

// Slick Slider
	$('.hero__items').slick({
    autoplay: true,
		arrows: false,
		dots: true,
    infinite: true,
    speed: 500,
    fade: true,
    cssEase: 'linear',
  });

  // MixItUp
	var mixer = mixitup('.products__items', {
    animation: {
      effects: 'fade translateZ(-100px)'
    }
});

});