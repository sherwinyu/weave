describe "FriendFilter", ->
  beforeEach ->
    @friendFilter = Weave.FriendFilter.create()
    fbData = [
      name: "Yan Zhang"
      location:
        id: "108056275889020"
        name: "Cambridge, Massachusetts"

      id: "4549"
      picture:
        data:
          url: "https://profile-a.xx.fbcdn.net/hprofile-prn1/49133_4549_9454_q.jpg"
          is_silhouette: false
    ,
      name: "Seth A. Bannon"
      id: "15976"
      picture:
        data:
          url: "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-prn2/187292_15976_1750647127_q.jpg"
          is_silhouette: false
    ,
      name: "Greg Poulos"
      id: "20495"
      picture:
        data:
          url: "https://profile-b.xx.fbcdn.net/hprofile-prn1/70901_20495_660540220_q.jpg"
          is_silhouette: false
    ,
      name: "Menyoung Lee"
      id: "30608"
      picture:
        data:
          url: "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-ash4/369081_30608_167074525_q.jpg"
          is_silhouette: false
    ]

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
    # @friendSource = @friendFilter.friendSource()

  afterEach ->
    @facebookQuery.restore()

  describe "friendResultToFriendStruct", ->
    it "works", ->
      friendStruct = @friendFilter.friendResultToFriendStruct @fbFriendResult1, "FACEBOOK"
      expect(friendStruct).toEqual
        label: @fbFriendResult1.name
        user:
          name: @fbFriendResult1.name
          email: @fbFriendResult1.email
          info:
            name: @fbFriendResult1.name
            provider: "FACEBOOK"
            uid: @fbFriendResult1.id
            email: @fbFriendResult1.email
            other_info: @fbFriendResult1

  describe "friendSource", ->

    beforeEach ->
      @getAuth = sinon.stub(@friendFilter, 'get')
      @getAuth.withArgs('auth.omniauthed').returns true
    afterEach ->
      @getAuth.restore()
    it "calls facebook.query", ->
      @friendSource = @friendFilter.friendSource()
      expect(@facebookQuery).toHaveBeenCalledOnce()
      expect(@facebookQuery).toHaveBeenCalledWith("/me/friends")
    it "returns a promise of friend structs", ->
      @friendSource = @friendFilter.friendSource()
      @friendSource.then (results) =>
        expect(results).toEqual
        [ @fbFriendResult1,
          @fbFriendResult2,
          @fbFriendResult3,
          @fbFriendResult4 ].map (fb) => @friendFilter.friendResultToFriendStruct(fb, "FACEBOOK")

  describe "filterAndRank", ->
    beforeEach ->
      dfd = new $.Deferred()
      dfd.resolve [@fbFriendResult1, @fbFriendResult2, @fbFriendResult3, @fbFriendResult4].map (f) => @friendFilter.friendResultToFriendStruct f, "FACEBOOK"
      @friendSource = dfd.promise()

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
        expect(friends[0].user.name).toBe "Yan Zhang"
        expect(friends[1].user.name).toBe "Jeff Zhang"

    it "sorts by score", ->
      term = "je zh"
      @filteredAndRanked = @friendFilter.filterAndRank(@friendSource, @friendFilter.scoreAgainstTerm term)
      @filteredAndRanked.then (friends) ->
        expect(friends.length).toBe 3
        expect(friends[0].user.name).toBe "Jeff Zhang"
        expect(friends[1].user.name).toBe "Yan Zhang"
        expect(friends[2].user.name).toBe "Jeff Chen"

  describe "filterAndRankAgainst", ->
    beforeEach ->
      @getAuth = sinon.stub(@friendFilter, 'get')
      @getAuth.withArgs('auth.omniauthed').returns true
    afterEach ->
      @getAuth.restore()
    it "returns a promise of friends #function_integration", ->
      results = @friendFilter.filterAndRankAgainst("je zh")
      results.then (friends) ->
        expect(friends.length).toBe 3
        expect(friends[0].user.name).toBe "Jeff Zhang"
        expect(friends[1].user.name).toBe "Yan Zhang"
        expect(friends[2].user.name).toBe "Jeff Chen"

  describe "score", ->
    beforeEach ->
      @friendStruct = # @friendFilter.friendResultToFriendStruct(@fbFriendResult1, "FACEBOOK")
        label: "Yan Zhang"
        user:
          name: "Yan Zhang"
          email: "Yan Zhang"
          meta:
            uid: "4549"
            name: "Yan Zhang"
            email: null
            provider: "FACEBOOK"
            other_info: null
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
