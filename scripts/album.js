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

// add my own album
var albumEurythmics = {
  title: 'Sweet Dreams',
  artist: 'Eurythmics',
  label: 'RCA Records',
  year: '1983',
  albumArtUrl: 'assets/images/album_covers/eurythmics.jpg',
  songs: [
    { title: 'Love is a Stranger', duration: '3:43' },
    { title: "I've Got an Angel", duration: '2:45' },
    { title: 'Wrap It Up', duration: '3:34' },
    { title: 'I Could Give You (A Mirror)', duration: '3:51' },
    { title: 'The Walk', duration: '4:43' },
    { title: 'Sweet Dreams (Are Made of This)', duration: '3:36' },
    { title: 'Jennifer', duration: '5:09' },
    { title: 'This is the House', duration: '5:01' },
    { title: 'Somebody Told Me', duration: '3:30' },
    { title: 'This City Never Sleeps', duration: '6:40' }
  ]
};

// create new song entry in table based on new song data
var createSongRow = function(songNumber, songName, songLength) {
  var template =
    '<tr class="album-view-song-item">'
    + ' <td class="song-item-number">' + songNumber + '</td>'
    + ' <td class="song-item-title">' + songName + '</td>'
    + ' <td class="song-item-duration">' + songLength + '</td>'
    + '</tr>'
    ;

    return template;
};

// (for assignment) move outside so can access easier
var albumTitle = document.getElementsByClassName('album-view-title')[0];
var albumArtist = document.getElementsByClassName('album-view-artist')[0];
var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
var albumImage = document.getElementsByClassName('album-cover-art')[0];
var albumSongList = document.getElementsByClassName('album-view-song-list')[0];

var setCurrentAlbum = function(album) {
  // #1 - identify where to add new album data based on class names
  // var albumTitle = document.getElementsByClassName('album-view-title')[0];
  // var albumArtist = document.getElementsByClassName('album-view-artist')[0];
  // var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
  // var albumImage = document.getElementsByClassName('album-cover-art')[0];
  // var albumSongList = document.getElementsByClassName('album-view-song-list')[0];

  // #2 - set new album info from passed argument, add as child entry
  albumTitle.firstChild.nodeValue = album.title;
  albumArtist.firstChild.nodeValue = album.artist;
  albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
  albumImage.setAttribute('src', album.albumArtUrl);

  // #3 - delete any existing entries
  albumSongList.innerHTML = '';

  // #4 - add each song in album to table
  for (var i = 0; i < album.songs.length; i++) {
    albumSongList.innerHTML += createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
  }
};

var allAlbums = [ albumPicasso, albumMarconi, albumEurythmics ];

window.onload = function() {
  var idx = 0;

  // display diff album when album cover image is clicked
  setCurrentAlbum( allAlbums[idx] );

  albumImage.addEventListener('click', function(e) {
    idx++;
    //console.log('show album ', idx);

    if ( idx === allAlbums.length ) {
      idx = 0     // wrap around to first album cover
    }
    //console.log("next album #" + idx);
    setCurrentAlbum( allAlbums[idx] );
  });

};
