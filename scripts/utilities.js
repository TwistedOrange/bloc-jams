function forEach( elem, callbackF ) {
  for ( var i=0; i<elem.length; i++ ) {
    //doSomething( elem[i] );
    callbackF( elem[i] );
  }

  // TESTING - callback to use on each array element
  function doSomething(oneElem) {
    console.log("at doSomething() in my forEach, point #", i);
  };
}
