// Example album
var albumPicasso = {
  title: 'The Colors',
  artist: 'Pablo Picasso',
  label: 'Cubism',
  year: '1881',
  albumArtUrl: 'assets/images/album_covers/01.png',
  songs: [
    { title: 'Blue', duration: '4:26' },
    { title: 'Green', duration: '3:14' },
    { title: 'Red', duration: '5:01' },
    { title: 'Pink', duration: '3:21' },
    { title: 'Magenta', duration: '2:15' }
  ]
};

// another example album
var albumMarconi = {
  title: 'The Telephone',
  artist: 'Guglielmo Marconi',
  label: 'EM',
  year: '1909',
  albumArtUrl: 'assets/images/album_covers/20.png',
  songs: [
    { title: 'Hello, Operator?', duration: '1:01' },
    { title: 'Ring, ring, ring', duration: '5:01' },
    { title: 'Fits in your pocket', duration: '3:21' },
    { title: 'Can you hear me now?', duration: '3:14' },
    { title: 'Wrong phone number', duration: '2:15' }
  ]
};

// create new song entry in table based on new song data
// retain song # in data-X attrib when replace it with play icon so it can be restored
var createSongRow = function(songNumber, songName, songLength) {
  var template =
    '<tr class="album-view-song-item">'
    + ' <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
    + ' <td class="song-item-title">' + songName + '</td>'
    + ' <td class="song-item-duration">' + songLength + '</td>'
    + '</tr>'
    ;

    return template;
};

var setCurrentAlbum = function(album) {
  // #1 - identify where to add new album data based on class names
  var albumTitle = document.getElementsByClassName('album-view-title')[0];
  var albumArtist = document.getElementsByClassName('album-view-artist')[0];
  var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
  var albumImage = document.getElementsByClassName('album-cover-art')[0];
  var albumSongList = document.getElementsByClassName('album-view-song-list')[0];

  // #2 - set new album info from passed argument, add as child entry
  albumTitle.firstChild.nodeValue = album.title;
  albumArtist.firstChild.nodeValue = album.artist;
  albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
  albumImage.setAttribute('src', album.albumArtUrl);

  // #3 - delete any existing entries
  albumSongList.innerHTML = '';

  // #4 - add each song in album as a new table row
  for (var i = 0; i < album.songs.length; i++) {
    albumSongList.innerHTML += createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
  }
};

// For given element, find nearest parent with the specified class name
var findParentByClassName = function(elem, findParentName) {
  // check if requested parent class exists anywhere
  var node = document.querySelector('.'+ findParentName);

  if ( node === null ) {
    console.log('No element found with that classname');
    return null;
  }

  // errors in requested parent or elem itself
  if ( elem === null ) {
    return null;
  }

  // from initial element traverse up DOM for parent with class name
  var thisParent = elem.parentElement;

  // does not handle multiple class names e.g., class="cname1 cname2 cname3"
  while ( thisParent.className !== findParentName && thisParent.className !== null ) {
    thisParent = thisParent.parentElement;
  }
  return thisParent;
};

// Return immediate parent of given song element (from any event type)
var getSongItem = function(elem) {
    switch (elem.className) {
        case 'album-song-button':
        case 'ion-play':      // for play button class
        case 'ion-pause':     // for pause button class
          return findParentByClassName(elem, 'song-item-number');
        case 'album-view-song-item':
          return elem.querySelector('.song-item-number');
        case 'song-item-title':
        case 'song-item-duration':
          return findParentByClassName(elem, 'album-view-song-item').querySelector('.song-item-number');
        case 'song-item-number':
          return elem;
        default:
          return;
    }
};

// Take action on clicked song depending on status of current song (if playing)
/*
State A = Not Playing (no songs in active play or paused)
1. On click show play icon for current song, start playing song
2. On mouseover show play icon for current song in place of song #
3. On mouseleave, remove play icon from current song, restore song #

State B = playing (icon shown = pause)
1. On click paused song, restore song # and remove pause icon (goto state A)
2. On mouseover for active song, highlight pause icon
3. On mouseleave for active song, restore pause icon
4. On mouseover for non-playing song show play icon
5. On mouseleave for non-playing song remove play icon (restore song #)

State C = paused (last played song is now paused)
1. On click active song, restore song #, remove pause icon, no songs now playing
2. On click non-actives song, switch to new playing song (restore paused song to
normal state, add play button to this new song replacing its song #)
3. On mouseover (not paused song), display play icon
4. On mouseleave (not paused song), restore song # replacing play icon

*/
var clickHandler = function(targetElement) {
  var songItem = getSongItem(targetElement);

  if ( currentlyPlayingSong === null ) {
    songItem.innerHTML = pauseButtonTemplate;     // show pause icon for selected song
    currentlyPlayingSong = songItem.getAttribute('data-song-number');
  } else if ( currentlyPlayingSong === songItem.getAttribute('data-song-number')) {
    songItem.innerHTML = playButtonTemplate;      // switch to play icon
    currentlyPlayingSong = null;                  // no song is playing
  } else if ( currentlyPlayingSong !== songItem.getAttribute('data-song-number')) {
    // user picked a different song (not last active song) to play
    var currentlyPlayingSongElement = document.querySelector('[data-song-number="' + currentlyPlayingSong + '"]');

    currentlyPlayingSongElement.innerHTML = currentlyPlayingSongElement.getAttribute('data-song-number');

    // update currently playing song to show pause button
    songItem.innerHTML = pauseButtonTemplate;
    currentlyPlayingSong = songItem.getAttribute('data-song-number');
  }
};

// elements to which we'll be adding listeners
var songListContainer = document.getElementsByClassName('album-view-song-list')[0];
var songRows = document.getElementsByClassName('album-view-song-item');

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

// store state of playing songs
var currentlyPlayingSong = null;

window.onload = function() {
  setCurrentAlbum(albumPicasso);

  // for song not currently playing, show play icon in case user clicks song to play
  //    (which will cause currently playing song to stop & remove its pause icon)
  songListContainer.addEventListener('mouseover', function(e) {
    // console.log(e.target);
    // only target individual song rows during event delegation
    if ( e.target.parentElement.className === 'album-view-song-item' ) {
      // change the content for current (moused over) from songNumber to the play button's HTML

      // show play button for anything other than currently playing song
      var thisSong = getSongItem(e.target);

      if ( thisSong.getAttribute('data-song-number') !== currentlyPlayingSong ) {
        thisSong.innerHTML = playButtonTemplate;      // show play button
      }
    }
  });

  // attach to each row (instead of using event delegation) because action of
  //   leaving a cell can't be specified as easily by listening to the parent.
  for (var i = 0; i < songRows.length; i++) {
    songRows[i].addEventListener('mouseleave', function(e) {
      // restore the song number and replace the play button

      // #1 this is the song the mouse is leaving from
      var songItem = getSongItem(e.target);
      var songItemNumber = songItem.getAttribute('data-song-number');

      // #2 test if recently left song (from mouseover) is not the playing song
      //    do not want to change state of playing song just because of mouse move
      if ( songItemNumber !== currentlyPlayingSong ) {
        songItem.innerHTML = songItemNumber;
      }
    });

    // a song was clicked, change its state and update current song
    songRows[i].addEventListener('click', function(e) {
      clickHandler(e.target);
    });
  }
};
