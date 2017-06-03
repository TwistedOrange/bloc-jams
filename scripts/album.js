
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
      var songNumber = parseInt($(this).attr('data-song-number'));

      // user selected a new song to play
      if ( currentlyPlayingSongNumber === null ) {
        // new song to play
        //currentlyPlayingSongNumber = songNumber;
        $(this).html(pauseButtonTemplate);
        setSong(songNumber);

        currentSoundFile.play();

      } else if (currentlyPlayingSongNumber !== songNumber ) {
        // new song is now playing, show pause icon
        setSong(songNumber);
        currentSoundFile.play();

        //--$('.song-item-number').eq(currentlyPlayingSongNumber - 1).html(currentlyPlayingSongNumber);
        //    equiv to using new getSongNumberCell()
        //
        var $restoreSongNumber = getSongNumberCell(currentlyPlayingSongNumber);
        $restoreSongNumber.html(currentlyPlayingSongNumber);

        // replace song # of selected song with pause icon
        $(this).html(pauseButtonTemplate);

        // update active song #
        //--currentlyPlayingSongNumber = songNumber;
        //--currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
        setSong(songNumber);

        // update song bar to reflect song status
        updatePlayerBarSong();

      } else if ( currentlyPlayingSongNumber === songNumber ) {
        // user paused previously active song
        $(this).html(songNumber);             // restore song #

        if ( currentSoundFile.isPaused() ) {
          // update player bar to reflect song status
          $(this).html(pauseButtonTemplate);
          $('.main-controls .play-pause').html(playerBarPlayButton);
          //currentSoundFile.play();
        } else {
          $(this).html(playButtonTemplate);
          $('.main-controls .play-pause').html(playerBarPauseButton);
          //currentSoundFile.pause();
        }
        currentSoundFile.togglePlay();

      } // paused current song

      // update bottom player bar with current song info & status
      updatePlayerBarSong();
    };

    // Replaces 'mouseover' event handler
    //    swap out song number with play/pause icon
    var onHover = function(e) {
      var $songCell = $(this).find('.song-item-number');
      // force string to int for accurate comparison
      var songNumber = parseInt($songCell.attr('data-song-number'));

      // If current song not playing, swap out song # for Play icon

      if ( songNumber !== currentlyPlayingSongNumber) {
        $songCell.html(playButtonTemplate);
      }
    };

    var offHover = function(e) {
      var $songCell = $(this).find('.song-item-number');
      // force string to int for accurate comparison
      var songNumber = parseInt($songCell.attr('data-song-number'));

      if ( songNumber !== currentlyPlayingSongNumber ) {
        // restore the song number to replace the icon
        $songCell.html(songNumber);
      }
    };

    // for clicked row, assign click event to the song # field
    $row.find('.song-item-number').click(clickHandler);

    // combine mouseover/mouseleave functionality with single event
    $row.hover(onHover, offHover);

    // return the new row with attached click handlers
    return $row;
};


/**
 * setSong() - fetch song object for selected song to play
 * @param  {string} songNumber [displayed song number]
 * @return {[n/a]}
 */
var setSong = function(songNumber) {
  // prevent song from playing on top of each other
  if ( currentSoundFile ) {
    currentSoundFile.stop();
  }

  currentlyPlayingSongNumber = songNumber;
  currentSongFromAlbum = currentAlbum.songs[songNumber - 1];

  currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
    formats: [ 'mp3' ],
    preload: true
  });

  setVolume(currentVolume);
};

//** Return HTML song element for given song number
var getSongNumberCell = function(number) {
  return $('.song-item-number[data-song-number="' + number + '"]');
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

// return index (song number) of given song in the requested album
var trackIndex = function(album, song) {
  return album.songs.indexOf(song);
};

// update player bar with song title & artist name for selected song
var updatePlayerBarSong = function() {

  // capture state when toggle same song from play to pause to play
  //  song number is not yet set
  if ( currentlyPlayingSongNumber !== null ) {
    $('h2.song-name').text(currentAlbum.songs[currentlyPlayingSongNumber - 1].title);
    $('h2.artist-song-mobile').text(currentAlbum.title + ' - ' + currentAlbum.artist);

    // replicate song state on lower player bar
    $('.main-controls .play-pause').html(playerBarPauseButton);
  }

  $('h2.artist-name').text(currentAlbum.artist);

  if ( currentlyPlayingSongNumber === null ) {
    // no song playing, remove the song title from player bar
    //$('h2.song-name').html('');
  }
};

// jump to next song in album to play (update player bar & album list)
var nextSong = function() {

  var songIndexInAlbum = trackIndex(currentAlbum, currentSongFromAlbum);
  songIndexInAlbum++;

  // jump to first song if at last song
  //songIndexInAlbum >= currentAlbum.songs.length ? songIndexInAlbum = 0 : songIndexInAlbum++;
  if ( songIndexInAlbum >= currentAlbum.songs.length ) {
    songIndexInAlbum = 0;
  }
  // prep for the next song to be played
  var recentSongPlayed = currentlyPlayingSongNumber;
  currentlyPlayingSongNumber = songIndexInAlbum + 1;

  // change to new/next song in album
  currentSongFromAlbum = currentAlbum.songs[songIndexInAlbum];

  setSong(songIndexInAlbum + 1);
  currentSoundFile.play();
  updatePlayerBarSong();

  var $nextSong = getSongNumberCell(currentlyPlayingSongNumber);
  var $previousSong = getSongNumberCell(recentSongPlayed);

  $nextSong.html(pauseButtonTemplate);
  $previousSong.html(recentSongPlayed);
};

var prevSong = function() {

  var songIndexInAlbum = trackIndex(currentAlbum, currentSongFromAlbum);
  songIndexInAlbum--;

  // jump to last song if at the first song
  if ( songIndexInAlbum  < 0 ) {
    songIndexInAlbum = currentAlbum.songs.length - 1;
  }
  var recentSongPlayed = currentlyPlayingSongNumber;
  currentlyPlayingSongNumber = songIndexInAlbum + 1;

  setSong(songIndexInAlbum + 1);
  currentSoundFile.play();
  updatePlayerBarSong();

  // change to new/next song in album
  currentSongFromAlbum = currentAlbum.songs[songIndexInAlbum];

  var $nextSong = getSongNumberCell(currentlyPlayingSongNumber);
  var $previousSong = getSongNumberCell(recentSongPlayed);

  $nextSong.html(pauseButtonTemplate);
  $previousSong.html(recentSongPlayed);
};

var setVolume = function(level) {
  if ( currentSoundFile ) {
    currentSoundFile.setVolume(level);
  }
};


var togglePlayFromPlayerBar = function() {
  var $playingSongCell = getSongNumberCell(currentlyPlayingSongNumber);

  if ( currentSoundFile ) {
    if ( currentSoundFile.isPaused() ) {
      //console.log('song is paused, change player bar icon from Pause to Play');
      $playingSongCell.html(playButtonTemplate);
      $(this).html(playerBarPlayButton);
    } else {
      //console.log('song is playing, change player bar icon from Play to Pause');
      $playingSongCell.html(pauseButtonTemplate);
      $(this).html(playerBarPauseButton);
    }

    currentSoundFile.togglePlay();
  }
};

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

var currentlyPlayingSongNumber = null;
var currentAlbum = null;
var currentSongFromAlbum = null;      // current song's object
var currentSoundFile = null;          // song sound file object
var currentVolume = 80;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
var $playBarPlayPauseControl = $('.main-controls .play-pause');


$(function() {      // DOM is ready
  setCurrentAlbum(albumPicasso);

  $previousButton.click(prevSong);
  $nextButton.click(nextSong);

  $playBarPlayPauseControl.click(togglePlayFromPlayerBar);
});
