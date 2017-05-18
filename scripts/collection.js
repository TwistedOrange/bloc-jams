// Replaces appended HTML code that represents one collection item
var buildCollectionItemTemplate = function() {
  var template =
    // #1 - code for one instance of an album entry
    '<div class="collection-album-container column fourth">'
    + '  <img src="assets/images/album_covers/01.png" alt="">'
    + '  <div class="collection-album-info caption">'
    + '    <p>'
    + '      <a class="album-name" href="album.html" >The Colors</a>'
    + '      <br/>'
    + '      <a href="album.html">Pablo Picasso</a>'
    + '       <br/>'
    + '      X songs'
    + '      <br/>'
    + '    </p>'
    + '  </div>'
    + '</div>'
    ;

    // wrap the template code in $() so it can use jQuery methods
    return $(template);
};

$(window).load(function() {
  // get all elements of named class
  var $collectionContainer = $('.album-covers');

  // remove any existing text to all elements that do not have children
  $collectionContainer.empty();

  for (var i=0; i<12; i++) {
    var $newThumbnail = buildCollectionItemTemplate();

    // replaces " += " to concatenate the template's HTML
    $collectionContainer.append( $newThumbnail );
  }
});
