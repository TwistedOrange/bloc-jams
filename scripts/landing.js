// var pointsArray = document.getElementsByClassName('point');
//
// var animatePoints = function(points) {
//
//   var revealPoint = function(index) {
//     points[index].style.opacity = 1;
//     points[index].style.transform = "scaleX(1) translateY(0)";
//     points[index].style.msTransform = "scaleX(1) translateY(0)";
//     points[index].style.WebkitTransform = "scaleX(1) translateY(0)";
//   }
//
//   for (var i=0; i<points.length; i++) {
//    revealPoint(i);
//   }
// };

// jQuery version
var animatePoints = function() {
  var revealPoint = function() {
    // #7 replaces multiple style property instances, vendor prefixes not needed
    $(this).css( {
      opacity: 1,
      transform: 'scaleX(1) translateY(0)'
    });
  };

  // #6 iterate over each point elem relacing for loop
  $.each($('.point'), revealPoint);
};

// window.onload = function() {
//   var sellingPoints = document.getElementsByClassName('selling-points')[0];
//   var scrollDistance = sellingPoints.getBoundingClientRect().top - window.innerHeight + 200;
//
//   window.addEventListener('scroll', function(event) {
//     if ( document.documentElement.scrollTop || document.body.scrollTop >= scrollDistance ) {
//       animatePoints(pointsArray);
//     }
//   });

// jQuery version
$(window).load(function() {
  // animate points on tall screen when scrolling can't trigger animation
  // #1
  if ($(window).height() > 950 ) {
    animatePoints();
  }

  // #2
  var scrollDistance = $('.selling-points').offset().top - $(window).height() + 200;

  // #3 - replaces addEventListener()
  $(window).scroll(function(event) {
    // #4
    if ( $(window).scrollTop() >= scrollDistance ) {
      animatePoints();
    }
  });
});
