var animatePoints = function() {
  var ptNode = document.getElementsByClassName('point');

  var revealPoint = function(i) {
    ptNode[i].style.opacity = 1;
    ptNode[i].style.transform = "scaleX(1) translateY(0)";
    ptNode[i].style.msTransform = "scaleX(1) translateY(0)";
    ptNode[i].style.WebkitTransform = "scaleX(1) translateY(0)";
  }

  for (var i=0; i<ptNode.length; i++) {
   revealPoint(i);
  }
};
