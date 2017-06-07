var albumPicasso_OLD = {
  title: 'The Colors',
  artist: 'Pablo Picasso',
  label: 'Cubism',
  year: '1881',
  albumArtUrl: 'assets/images/album_covers/01.png',
  songs: [
    { title: 'Blue', duration: '4:26', audioUrl: 'assets/music/blue' },
    { title: 'Green', duration: '3:14', audioUrl: 'assets/music/green' },
    { title: 'Red', duration: '5:01', audioUrl: 'assets/music/red' },
    { title: 'Pink', duration: '3:21', audioUrl: 'assets/music/pink' },
    { title: 'Magenta', duration: '2:15', audioUrl: 'assets/music/magenta' }
  ]
};


// source: http://www.barbneal.com/the-collection/tv-theme-songs/
var albumPicasso = {
  title: "70's TV Theme Songs",
  artist: 'Various Artists',
  label: '',
  year: '1973-1978',
  albumArtUrl: 'assets/images/album_covers/70s-tv.jpg',
  // songs: [
  //   { title: 'Green Acres', duration: '1:04', audioUrl: 'assets/music/grnacres' },
  //   { title: 'Andy Griffith Show', duration: '0:50', audioUrl: 'assets/music/andgrif' },
  //   { title: 'Cheers', duration: '1:03', audioUrl: 'assets/music/cheers' },
  //   { title: "Gilligan's Island", duration: '1:31', audioUrl: 'assets/music/gilligan' },
  //   { title: 'Batman', duration: '0:43', audioUrl: 'assets/music/batman' }
  // ]
  // change to seconds, added new field 'length' for actual song length to display
  songs: [
    { title: 'Green Acres', length: '1:04', duration: 161.71, audioUrl: 'assets/music/grnacres' },
    { title: 'Andy Griffith Show', length: '0:50', duration: 103.95, audioUrl: 'assets/music/andgrif' },
    { title: 'Cheers', length: '1:03', duration: 268.45, audioUrl: 'assets/music/cheers' },
    { title: "Gilligan's Island", length: '1:31', duration: 153.45, audioUrl: 'assets/music/gilligan' },
    { title: 'Batman', length: '0:43', duration: 374.22, audioUrl: 'assets/music/batman' }
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
