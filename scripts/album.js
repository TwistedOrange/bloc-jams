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
// retain song # in data-X attrib so it can be restored
var createSongRow = function(songNumber, songName, songLength) {
  var template =
    '<tr class="album-view-song-item">'
    + ' <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
    + ' <td class="song-item-title">' + songName + '</td>'
    + ' <td class="song-item-duration">' + songLength + '</td>'
    + '</tr>'
    ;

    // wrap template in jQuery object for later use
    var $row = $(template);

    // replaces standalone clickHandler()
    var clickHandler = function() {
      var songNumber = $(this).attr('data-song-number');``
      var chosenSong = $(this).find('.song-item-number');

      // user selected a new song to play
      if ( currentlyPlayingSong === null ) {
        // new song to play
        //console.log('no song playing, play #' + songNumber)
        currentlyPlayingSong = songNumber;
        $(this).html(pauseButtonTemplate);
      } else if (currentlyPlayingSong !== songNumber ) {
        // replace pause icon for currently playing song with its song #
        $('.song-item-number').eq(currentlyPlayingSong-1).html(currentlyPlayingSong);

        // replace song # of selected song with pause icon
        $(this).html(pauseButtonTemplate);
        // update active song #
        currentlyPlayingSong = songNumber;
        //console.log('user wants to play song #' + songNumber);
      } else if ( currentlyPlayingSong === songNumber ) {
        // user paused this song, no song is actively playing
        $(this).html(songNumber);             // restore song #
        currentlyPlayingSong = null;
        //console.log('song ' + songNumber + ' is playing, stop playing');
      }
    };

    // define click handlers to replace the for-loop in window.onload that
    //   adds even listener to each row

    // Replaces 'mouseover' event handler
    //    swap out song number with play/pause icon
    var onHover = function(e) {
      var $selectedSong = $(this).find('.song-item-number');

      // is this song the one that's currently playing? You can tell because
      //   the data-X field stores the song number. If it's not playing,
      //   swap out the song # for the Play icon
      if ( $selectedSong.attr('data-song-number') !== currentlyPlayingSong ) {
        $selectedSong.html(playButtonTemplate);
      }
    };

    var offHover = function(e) {
      var $selectedSong = $(this).find('.song-item-number');
      //var $songNum = $selectedSong.attr('data-song-number');

      if ( songNumber != currentlyPlayingSong ) {
        // restore the song number to replace the icon
        $selectedSong.html(songNumber);
      }
    };

    // for clicked row, assign click event to the song # field
    $row.find('.song-item-number').click(clickHandler);

    // combine mouseover/mouseleave functionality with single event
    $row.hover(onHover, offHover);

    // return the new row with attached click handlers
    return $row;
};

var setCurrentAlbum = function(album) {
  // identify where to add new album data based on class names
  var $albumTitle = $('.album-view-title');
  var $albumArtist = $('.album-view-artist');
  var $albumReleaseInfo = $('.album-view-release-info');
  var $albumImage = $('.album-cover-art');
  var $albumSongList = $('.album-view-song-list');

  // set new album info from passed argument, add as child entry
  $albumTitle.text(album.title);
  $albumArtist.text(album.artist);
  $albumReleaseInfo.text(album.year + ' ' + album.label);
  $albumImage.attr('src', album.albumArtUrl);

  // delete any existing entries
  $albumSongList.empty();

  // add each song in album as a new table row
  for (var i = 0; i < album.songs.length; i++) {
    //albumSongList.innerHTML += createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
    var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);

    $albumSongList.append($newRow);
  }
};

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

// store the # of song that's now playing
var currentlyPlayingSong = null;

$(document).ready(function() {
  setCurrentAlbum(albumPicasso);
});
