describe "player", ->
  beforeEach ->
    @player = new Player()
    @song = new Song()
  it "plays a song", ->
    @player.play @song
    expect(@player.currentlyPlayingSong).toEqual @song