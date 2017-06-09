
// create new song entry in table based on new song data
// retain song # in data-X attrib so it can be restored
var createSongRow = function(songNumber, songName, songLength) {
  var template =
    '<tr class="album-view-song-item">'
    + ' <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
    + ' <td class="song-item-title">' + songName + '</td>'
    + ' <td class="song-item-duration">' + songLength + '</td>'
    + '</tr>';

  // wrap template in jQuery object for later use
  var $row = $(template);

  var clickHandler = function() {
    var songNumber = parseInt($(this).attr('data-song-number'));

    if (currentlyPlayingSongNumber !== null) {
        // replace song number for current/previous song since new song is now playing
        var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);

        currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
        currentlyPlayingCell.html(currentlyPlayingSongNumber);
    }

   if (currentlyPlayingSongNumber !== songNumber) {
       // new song, go from pause to play
       setSong(songNumber);
       currentSoundFile.play();

       // sync song duration seek-bar control to current song
       updateSeekBarWhileSongPlays();

       $(this).html(pauseButtonTemplate);
       currentSongFromAlbum = currentAlbum.songs[songNumber - 1];

      // grab the vol control seek-bar and thumb adjustment knob
      //  class 'seek-bar' is parent to fill and thumb classes
       var $volFill = $('volume .fill');
       var $volThumb = $('volume .thumb');

       // change width of volume seek-bar to new volume
       $volFill.width(currentVolume + '%');
       $volThumb.css('left', currentVolume + '%');

       updatePlayerBarSong();

   } else if (currentlyPlayingSongNumber === songNumber) {
      if (currentSoundFile.isPaused()) {
          $(this).html(pauseButtonTemplate);
          $('.main-controls .play-pause').html(playerBarPauseButton);
          currentSoundFile.play();

          // sync song duration seek-bar control to current song
          updateSeekBarWhileSongPlays();
      } else {
          $(this).html(playButtonTemplate);
          $('.main-controls .play-pause').html(playerBarPlayButton);
          currentSoundFile.pause();
      }
    }
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
};   // end clickHandler()


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

// Update position of seekbar when song is playing to match duration
var updateSeekBarWhileSongPlays = function() {
  if ( currentSoundFile ) {
    // tie Buzz event 'timeupdate' to current song as it's playing
    currentSoundFile.bind('timeupdate', function(event) {
      // Use Buzz library getTime() and getDuration() of active song (returns seconds)
      // http://buzz.jaysalvat.com/documentation/sound/

      var seekBarFillRatio = this.getTime() / this.getDuration();
      var $seekBar = $('.seek-control .seek-bar');

      updateSeekPercentage($seekBar, seekBarFillRatio);

      setCurrentTimeInPlayerBar(currentSoundFile.getTime());
    });
  }
};


/**
 * Update song seek bar based on song duration
 * @param  {jQuery DOM} $seekBar         playback control; volume or playback
 * @param  {percentage} seekBarFillRatio CSS property
 */
var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
  var offsetXPercent = seekBarFillRatio * 100;
  offsetXPercent = parseInt(offsetXPercent);   // whole # only

  // confirm range between 0 - 100
  offsetXPercent = Math.max(0, offsetXPercent);
  offsetXPercent = Math.min(100, offsetXPercent);

  var percentageString = offsetXPercent + '%';
  // left side of duration bar (time played so far)
  $seekBar.find('.fill').width(percentageString);

  // right side of duration bar (time remaining, %)
  $seekBar.find('.thumb').css( { left: percentageString });
};


// Update status of Volume & Duration seekbars during play
var setupSeekBars = function() {
  var $seekBars = $('.player-bar .seek-bar');

  $seekBars.click(function(event) {
    // save horz coordinate at which event occurred (location on
    //  seek control bar that was clicked to change what
    //  part of song is to be played)
    var offsetX = event.pageX - $(this).offset().left;
    var barWidth = $(this).width();

    // new width of seek bar after adjusted by clicked
    var seekBarFillRatio = offsetX / barWidth;

    // Which seek-bar was clicked? Vol or duration.
    if ( $(this).parent().hasClass('volume') ) {
      setVolume( seekBarFillRatio * 100 );
    } else {
      // song length in seconds * new seek-bar length
      seek(seekBarFillRatio * currentSoundFile.getDuration());
    }
    updateSeekPercentage( $(this), seekBarFillRatio );

  });

  //------
  // handle dragging thumb circle on seekbar w/ mouse events
  //------
  // Add event listener for mousedown on thumb portion of seekbar
  $seekBars.find('.thumb').mousedown(function(event) {
    // fetch the .thumb node clicked to know which .seek-bar it belongs to
    var $seekBar = $(this).parent();

    // 'bind' is similar to addEventListener(), supports namespaces to be
    //    more specific as to where the event is used.
    //    (name could of been 'mousemove.thumbOnSeekBar', .thumb not significant)
    $(document).bind('mousemove.thumb', function(event) {
        var offsetX = event.pageX - $seekBar.offset().left;
        var barWidth = $seekBar.width();
        var seekBarFillRatio = offsetX / barWidth;

        updateSeekPercentage($seekBar, seekBarFillRatio);
    });

    // Attach mousemove() event to $(document) (the entire page) to ensure
    //    can drag thumb marker after mousing down, even when mouse leaves seek bar.
    //    This makes for a better UX since the active area is broader.
    $(document).bind('mouseup.thumb', function() {
        // Remove previous events tied to this HTML element when mouse released
        // Namespacing used to make event more specific, '.' notation where
        //    eventname.namespace is the syntax and namespace is anything.
        $(document).unbind('mousemove.thumb');
        $(document).unbind('mouseup.thumb');
    });

  });
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

  // set max song length in seek-bar - NOT WORK IF SONG PAUSED, writes "--"
  //setTotalTimeInPlayerBar(currentSoundFile.getDuration());

  setTotalTimeInPlayerBar(currentSongFromAlbum.duration);

  $('h2.artist-name').text(currentAlbum.artist);
};

// jump to next song in album to play (update player bar & album list)
var nextSong = function() {
  var songIndexInAlbum = trackIndex(currentAlbum, currentSongFromAlbum);
  songIndexInAlbum++;

  // jump to first song if at last song
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

  // sync song duration seek-bar control to current song
  updateSeekBarWhileSongPlays();

  updatePlayerBarSong();

  var $nextSong = getSongNumberCell(currentlyPlayingSongNumber);
  var $previousSong = getSongNumberCell(recentSongPlayed);

  $nextSong.html(pauseButtonTemplate);
  $previousSong.html(recentSongPlayed);

  // display song length of new song under duration seek-bar
  //displaySongLength();
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

  // sync song duration seek-bar control to current song
  updateSeekBarWhileSongPlays();

  updatePlayerBarSong();

  // change to new/next song in album
  currentSongFromAlbum = currentAlbum.songs[songIndexInAlbum];

  var $nextSong = getSongNumberCell(currentlyPlayingSongNumber);
  var $previousSong = getSongNumberCell(recentSongPlayed);

  $nextSong.html(pauseButtonTemplate);
  $previousSong.html(recentSongPlayed);
};


// Update to new song location (time) when click seek-bar
var seek = function(time) {
  if ( currentSoundFile ) {
    // Buzz library setTime() - set playback positon in seconds
    currentSoundFile.setTime(time);
  }
};


//** ASSIGNMENT NEW CODE

//** Reformat seconds to "m:ss" to display in duration seek-bar
var filterTimeCode = function(timeInSeconds) {
  var seconds = parseFloat(timeInSeconds);      // string to float

  //console.log('filterTimeCode()', seconds);
  //
  // Buzz library provides this functionality, returns "mm:ss"
  // var timeFormat = buzz.toTimer(seconds).slice(1);
  //
  // return timeFormat;

  // other way w/o using buzz.toTimer() method

  if ( seconds < 60 ) {
    return '0:' + timeInSeconds * 60;
  } else if ( seconds === 60 ) {
    return '1:00';
  }

  var fullMinutes = Math.floor(seconds / 60);
  var fullSecs = parseInt(seconds) - fullMinutes * 60;

  // format song length > 60 seconds as m:ss
  return fullMinutes + ':' + fullSecs;
};


//** updates songs time played in seek-bar as it plays
var setCurrentTimeInPlayerBar = function(currentTime) {
  var timeFormat = buzz.toTimer(currentTime).slice(1);

  //console.log('setCurrentTimeInPlayerBar()', timeFormat);
  $(document).find('.current-time').text(timeFormat);
};

//** Set text of element with .total-time class to length of song
//**   assume totalTime is seconds?
var setTotalTimeInPlayerBar = function(totalTime) {
  var formatTime = filterTimeCode(totalTime);

  $(document).find('.total-time').text(formatTime);
};


var setVolume = function(level) {
  if ( currentSoundFile ) {
    currentSoundFile.setVolume(level);
  }
};

// added from ckpt20-assignment
var togglePlayFromPlayerBar = function() {
  var $playingSongCell = getSongNumberCell(currentlyPlayingSongNumber);

  if ( currentSoundFile  ) {
    if ( currentSoundFile.isPaused() ) {
      //console.log('song is paused, change player bar icon from Pause to Play');
      $playingSongCell.html(pauseButtonTemplate);
      $(this).html(playerBarPauseButton);
      currentSoundFile.play();
    } else {
      //console.log('song is playing, change player bar icon from Play to Pause');
      $playingSongCell.html(playButtonTemplate);
      $(this).html(playerBarPlayButton);
      currentSoundFile.pause()
    }
  } else {    // special case, no song ever played, allow Play button to
              //    start song 1 just like next/prev buttons can
    nextSong();
  }
};


var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

var currentlyPlayingSongNumber = null;
var currentAlbum = null;
var currentSongFromAlbum = null;      // current song's object
var currentSoundFile = null;          // song sound file objects
var currentVolume = 80;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

var $playBarPlayPauseControl = $('.main-controls .play-pause');
var $playBarPlayIcon = $('.play-pause .ion-play');

$(function() {      // DOM is ready
  setCurrentAlbum(albumPicasso);
  setupSeekBars();

  $previousButton.click(prevSong);
  $nextButton.click(nextSong);

  $playBarPlayPauseControl.click(togglePlayFromPlayerBar);
});
