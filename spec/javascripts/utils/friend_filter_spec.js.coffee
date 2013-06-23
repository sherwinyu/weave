describe "FriendFilter", ->
  beforeEach ->
    @friendFilter = Weave.FriendFilter.create()
    @fbData = [
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
    ,
      name: "Jeff Zhang"
      id: "666"
      picture:
        data:
          url: "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-ash4/jeffreyzhang.jpg"
          is_silhouette: false
    ]

    @fbFriendResult1 = @fbData[0]
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
      data: @fbData
      paging:
        next: "http://someurl.com/somemethod/someparams?123"
    @facebookQuery = sinon.stub(facebook, "query")
    @facebookQuery.withArgs("/me/friends").returns dfd.promise()
    # @friendSource = @friendFilter.friendSource()

  afterEach ->
    @facebookQuery.restore()

  describe "friendStructFromPayload", ->
    it "returns the friend struct for provider: facebook", ->
      friendStruct = @friendFilter.friendStructFromPayload @fbFriendResult1, "FACEBOOK"
      expect(friendStruct).toEqual
        label: @fbFriendResult1.name
        pictureUrl: @fbFriendResult1.picture.data.url
        location: @fbFriendResult1.location.name
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
    describe "when logged in", ->
      it "calls @facebookFriends()  #temporary", ->
        getAuth = sinon.stub(@friendFilter, 'get')
        getAuth.withArgs('auth.omniauthed').returns true
        stubFacebookQuery = sinon.stub(@friendFilter, 'facebookFriends')

        @friendFilter.friendSource()
        expect(stubFacebookQuery).toHaveBeenCalledOnce()

        getAuth.restore()
        stubFacebookQuery.restore()
    describe "when not logged in", ->
      beforeEach -> @getAuth = sinon.stub(@friendFilter, 'get').returns false
      afterEach -> @getAuth.restore()
      it "returns a promise of an empty list", ->
        pList = @friendFilter.friendSource()
        list = null
        pList.then (arg) -> list = arg
        expect(list).toEqual []

      it "doesn't call facebookFriends", ->
        stubFacebookQuery = sinon.stub(@friendFilter, 'facebookFriends')
        friendSource = @friendFilter.friendSource()
        expect(stubFacebookQuery).not.toHaveBeenCalled()
        stubFacebookQuery.restore()

  describe "_filterAndRank", ->
    beforeEach ->
      pfriends = new $.Deferred()
      pfriends.resolve @fbData.map (f) => @friendFilter.friendStructFromPayload f, "FACEBOOK"
      @friendSource = sinon.stub(@friendFilter, 'friendSource').returns pfriends
      @scoreFtn = sinon.stub()

    it "only returns friends with positive score #PENDING", ->

  describe "_filterAndRank #integration", ->
    beforeEach ->
      dfd = new $.Deferred()
      dfd.resolve @fbData.map (f) => @friendFilter.friendStructFromPayload f, "FACEBOOK"
      @friendSource = dfd.promise()

    it "excludes results that score 0", ->
      term = "walasdl"
      @filteredAndRanked = @friendFilter._filterAndRank(@friendSource, @friendFilter._scoreAgainstTerm term)
      @filteredAndRanked.then (friends) ->
        expect(friends.length).toBe 0

    it "includes results that score above 0", ->
      term = "zh"
      @filteredAndRanked = @friendFilter._filterAndRank(@friendSource, @friendFilter._scoreAgainstTerm term)
      @filteredAndRanked.then (friends) ->
        expect(friends.length).toBe 2
        expect(friends[0].user.name).toBe "Yan Zhang"
        expect(friends[1].user.name).toBe "Jeff Zhang"

    it "sorts by score", ->
      term = "je zh"
      @filteredAndRanked = @friendFilter._filterAndRank(@friendSource, @friendFilter._scoreAgainstTerm term)
      @filteredAndRanked.then (friends) ->
        expect(friends.length).toBe 2
        expect(friends[0].user.name).toBe "Jeff Zhang"
        expect(friends[1].user.name).toBe "Yan Zhang"

  describe "filterAndRankAgainst", ->
    beforeEach ->
      @pFriends = ['mockFriendStruct1', 'mockFriendStruct2']
      @scoreFtn = (friendStruct) -> 5

      @friendSource = sinon.stub(@friendFilter, 'friendSource').returns @pFriends
      @scoreAgainstTerm = sinon.stub(@friendFilter, '_scoreAgainstTerm').returns @scoreFtn
      @filterAndRank = sinon.stub(@friendFilter, "_filterAndRank")

      @friendFilter.filterAndRankAgainst("je zh")

    afterEach ->
      @friendSource.restore()
      @scoreAgainstTerm.restore()
      @filterAndRank.restore()
    it "calls friendSource", ->
      expect(@friendSource).toHaveBeenCalledOnce()
    it "calls scoreAgainstTerm with the term", ->
      expect(@scoreAgainstTerm).toHaveBeenCalledOnce()
      expect(@scoreAgainstTerm).toHaveBeenCalledWith "je zh"
    it "calls _filterAndRank with friendSource and the curried scoreFtn", ->
      expect(@filterAndRank).toHaveBeenCalledWith @pFriends, @scoreFtn

    xit "does an integration test #integration", ->
      results = @friendFilter.filterAndRankAgainst("je zh")
      results.then (friends) ->
        expect(friends.length).toBe 3
        expect(friends[0].user.name).toBe "Jeff Zhang"
        expect(friends[1].user.name).toBe "Yan Zhang"
        expect(friends[2].user.name).toBe "Jeff Chen"

  describe "score", ->
    beforeEach ->
      @friendStruct =
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
      expect(@friendFilter._score "wala", @friendStruct).toBe 0
      expect(@friendFilter._score "yank", @friendStruct).toBe 0
    it "returns 1 for single match", ->
      expect(@friendFilter._score "ya", @friendStruct).toBe 1
    it "returns 2 for double match", ->
      expect(@friendFilter._score "ya zh", @friendStruct).toBe 2

    describe "_scoreAgainstTerm", ->
      it "returns a scoring function curried to a search term", ->
        scoreAgainstTerm = @friendFilter._scoreAgainstTerm("ya zh")
        expect(typeof scoreAgainstTerm).toBe "function"
        expect(scoreAgainstTerm.call(@friendFilter, @friendStruct)).toBe 2
