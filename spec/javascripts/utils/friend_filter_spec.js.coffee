describe "FriendFilter", ->
  beforeEach ->
    @friendFilter = Weave.FriendFilter.create()
    @fbFriendResult1 =
      id: "4549"
      name: "Yan Zhang"
    @fbFriendResult2 =
      id: "15796"
      name: "Seth Bannon"
    @fbFriendResult3 =
      id: "555"
      name: "Jeff Chen"
    @fbFriendResult4 =
      id: "666"
      name: "Jeff Zhang"

  beforeEach ->
    dfd = new $.Deferred()
    dfd.resolve
      data: [ @fbFriendResult1, @fbFriendResult2, @fbFriendResult3, @fbFriendResult4 ]
      paging:
        next: "http://someurl.com/somemethod/someparams?123"
    @facebookQuery = sinon.stub(facebook, "query")
    @facebookQuery.withArgs("/me/friends").returns dfd.promise()
    @friendSource = @friendFilter.friendSource()

  afterEach ->
    @facebookQuery.restore()

  describe "friendResultToFriendStruct", ->
    it "works", ->
      friendStruct = @friendFilter.friendResultToFriendStruct @fbFriendResult1, "FACEBOOK"
      expect(friendStruct).toEqual
        label: @fbFriendResult1.name
        meta:
          name: @fbFriendResult1.name
          provider: "FACEBOOK"
          uid: @fbFriendResult1.id
          info: @fbFriendResult1

  describe "friendSource", ->

    it "calls facebook.query", ->
      expect(@facebookQuery).toHaveBeenCalledOnce()
      expect(@facebookQuery).toHaveBeenCalledWith("/me/friends")
    it "returns a promise of friend structs", ->
      @friendSource.then (results) =>
        expect(results).toEqual
        [ @fbFriendResult1,
          @fbFriendResult2,
          @fbFriendResult3,
          @fbFriendResult4 ].map (fb) => @friendFilter.friendResultToFriendStruct(fb, "FACEBOOK")
  describe "filterAndRank", ->

    it "excludes results that score 0", ->
      term = "walasdl"
      @filteredAndRanked = @friendFilter.filterAndRank(@friendSource, @friendFilter.scoreAgainstTerm term)
      @filteredAndRanked.then (friends) ->
        expect(friends.length).toBe 0

    it "includes results that score above 0", ->
      term = "zh"
      @filteredAndRanked = @friendFilter.filterAndRank(@friendSource, @friendFilter.scoreAgainstTerm term)
      @filteredAndRanked.then (friends) ->
        expect(friends.length).toBe 2
        expect(friends[0].meta.name).toBe "Yan Zhang"
        expect(friends[1].meta.name).toBe "Jeff Zhang"

    it "sorts by score", ->
      term = "je zh"
      @filteredAndRanked = @friendFilter.filterAndRank(@friendSource, @friendFilter.scoreAgainstTerm term)
      @filteredAndRanked.then (friends) ->
        expect(friends.length).toBe 3
        expect(friends[0].meta.name).toBe "Jeff Zhang"
        expect(friends[1].meta.name).toBe "Yan Zhang"
        expect(friends[2].meta.name).toBe "Jeff Chen"

  describe "score", ->
    beforeEach ->
      @friendStruct = # @friendFilter.friendResultToFriendStruct(@fbFriendResult1, "FACEBOOK")
        label: "Yan Zhang"
        meta:
          name: "Yan Zhang"
          uid: "4549"
          provider: "FACEBOOK"
          info: null
    it "returns 0 for non matches", ->
      expect(@friendFilter.score "wala", @friendStruct).toBe 0
      expect(@friendFilter.score "yank", @friendStruct).toBe 0
    it "returns 1 for single match", ->
      expect(@friendFilter.score "ya", @friendStruct).toBe 1
    it "returns 2 for double match", ->
      expect(@friendFilter.score "ya zh", @friendStruct).toBe 2

    describe "scoreAgainstTerm", ->
      it "returns a scoring function curried to a search term", ->
        scoreAgainstTerm = @friendFilter.scoreAgainstTerm("ya zh")
        expect(typeof scoreAgainstTerm).toBe "function"
        expect(scoreAgainstTerm.call(@friendFilter, @friendStruct)).toBe 2
