function forEach( elem ) {
  for ( var i=0; i<elem.length; i++ ) {
    doSomething( elem[i] );
  }

  // callback to use on each array element
  function doSomething(oneElem) {
    console.log("at doSomething() in my forEach, point #", i);
  };
}

var pointsArray = document.getElementsByClassName('point');

forEach(pointsArray);
