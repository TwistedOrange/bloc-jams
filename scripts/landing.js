var animatePoints = function() {
  var points = document.getElementsByClassName('point');

  function revealPoint(ptIndx) {
   var ptNode = document.getElementsByClassName('point');

   function showPoint(ptIdx) {
     ptNode[ptIdx].style.opacity = 1;
     ptNode[ptIdx].style.transform = "scaleX(1) translateY(0)";
     ptNode[ptIdx].style.msTransform = "scaleX(1) translateY(0)";
     ptNode[ptIdx].style.WebkitTransform = "scaleX(1) translateY(0)";
   }
  }

   for (var i=0; i<ptNode.length; i++) {
     revealPoint(i);
   }
};
