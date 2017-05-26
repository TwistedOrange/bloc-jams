
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
      if ( currentlyPlayingSongNumber === null ) {
        // new song to play
        currentlyPlayingSongNumber = songNumber;
        $(this).html(pauseButtonTemplate);
      } else if (currentlyPlayingSongNumber !== songNumber ) {
        // replace pause icon for currently playing song with its song #
        $('.song-item-number').eq(currentlyPlayingSongNumber-1).html(currentlyPlayingSongNumber);

        // replace song # of selected song with pause icon
        $(this).html(pauseButtonTemplate);
        // update active song #
        currentlyPlayingSongNumber = songNumber;
        currentSongFromAlbum = currentAlbum.songs[songNumber-1];
        // update song bar to reflect song status
        updatePlayerBarSong();

      } else if ( currentlyPlayingSongNumber === songNumber ) {
        // user paused this song, no song is actively playing
        $(this).html(songNumber);             // restore song #

        // update player bar to reflect song status
        $('.main-controls .play-pause').html(playerBarPlayButton);
        //$('h2.song-name').html('');

        currentlyPlayingSongNumber = null;
        currentSongFromAlbum = null;
      }

      // update bottom player bar with current song info & status
      //updatePlayerBarSong();
    };

    // Replaces 'mouseover' event handler
    //    swap out song number with play/pause icon
    var onHover = function(e) {
      var $selectedSong = $(this).find('.song-item-number');

      // is this song the one that's currently playing? You can tell because
      //   the data-X field stores the song number. If it's not playing,
      //   swap out the song # for the Play icon
      if ( $selectedSong.attr('data-song-number') !== currentlyPlayingSongNumber ) {
        $selectedSong.html(playButtonTemplate);
      }
    };

    var offHover = function(e) {
      var $selectedSong = $(this).find('.song-item-number');
      //var $songNum = $selectedSong.attr('data-song-number');

      if ( songNumber != currentlyPlayingSongNumber ) {
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
  currentAlbum = album;       // global visibility

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

// update player bar with song title & artist name for selected song
var updatePlayerBarSong = function() {

  // capture state when toggle same song from play to pause to play append
  //  song number is not yet set
  if ( currentlyPlayingSongNumber !== null ) {
    $('h2.song-name').text(currentAlbum.songs[currentlyPlayingSongNumber-1].title);
    $('h2.artist-song-mobile').text(currentAlbum.title + ' - ' + currentAlbum.artist);
  }

  $('h2.artist-name').text(currentAlbum.artist);

  $('.main-controls .play-pause').html(playerBarPauseButton);

  if ( currentlyPlayingSongNumber === null ) {
    // no song playing, remove the song title from player bar
    //$('h2.song-name').html('');
  }
};

// return index (song number) of given song in the requested album
var trackIndex = function(album, song) {
  return album.songs.indexOf(song);
};

// jump to next song in album to play (update player bar & album list)
var nextSong = function() {

  if ( currentlyPlayingSong === null ) {
    return;           // no 'next' song to move to
  }

  var prevSong = currentSongFromAlbum;

  // jump to first song if at last song
  currentlyPlayingSong === 5 ? currentlyPlayingSong = 1 : currentlyPlayingSong++;

  //currentSongFromAlbum = trackIndex(currentAlbum, )
};

var prevSong = function() {

  if ( currentlyPlayingSong === null ) {
    return;           // no 'previous' song to move to
  }

  // jump to last song if at first song
  currentlyPlayingSong === 1 ? currentlyPlayingSong = 5 : currentlyPlayingSong--;

};

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

var currentlyPlayingSongNumber = null;
var currentAlbum = null;
var currentSongFromAlbum = null;

$(function() {      // DOM is ready
  setCurrentAlbum(albumPicasso);
});
