var pointsArray = document.getElementsByClassName('point');

var animatePoints = function(points) {
  forEach(points, revealPoint);

  // var revealPoint = function(index) {
  //   points[index].style.opacity = 1;
  //   points[index].style.transform = "scaleX(1) translateY(0)";
  //   points[index].style.msTransform = "scaleX(1) translateY(0)";
  //   points[index].style.WebkitTransform = "scaleX(1) translateY(0)";
  // }

  // for (var i=0; i<points.length; i++) {
  //  revealPoint(i);
  // }
};

// moved outside of animatePoints() as best practice per https://callbackhell.com
var revealPoint = function(pt) {
  pt.style.opacity = 1;
  pt.style.transform = "scaleX(1) translateY(0)";
  pt.style.msTransform = "scaleX(1) translateY(0)";
  pt.style.WebkitTransform = "scaleX(1) translateY(0)";
};

window.onload = function() {
  var sellingPoints = document.getElementsByClassName('selling-points')[0];
  var scrollDistance = sellingPoints.getBoundingClientRect().top - window.innerHeight + 200;

  window.addEventListener('scroll', function(event) {
    if ( document.documentElement.scrollTop || document.body.scrollTop >= scrollDistance ) {
      animatePoints(pointsArray);
    }
  });
}
