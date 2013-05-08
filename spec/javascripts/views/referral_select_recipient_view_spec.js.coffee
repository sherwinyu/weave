describe "ReferralSelectRecipientView", ->
  beforeEach ->
    @context = Ember.Object.create
      name: ""
      email: ""
      meta: Ember.Object.create
        provider: ""
        suggested: false
        other_info: null
    @view = Weave.ReferralSelectRecipientView.create
      recipient: @context
    Ember.run => @view.append()

  afterEach ->
    Ember.run =>
      @view.remove()
      @view.destroy()

  describe "structure", ->
    it "contains an input for name or email", ->
      expect(@view.$()).toContain 'input.recipient-name-or-email'
  it 'binds input#value to recipient.email', ->
    Ember.run =>
      @view.$('input.recipient-name-or-email').val "new@email.org"
      @view.$('input.recipient-name-or-email').blur()
    expect(@context.get 'email').toBe "new@email.org"

  it 'binds recipient.email to input#value', ->
    Ember.run =>
      @context.set 'email', 'new@email.org'
    expect(@view.$('input.recipient-name-or-email')).toHaveValue "new@email.org"

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
    beforeEach ->
      @friendSource = @friendFilter.friendSource()
      @filteredAndRanked = @friendFilter.filterAndRank()
    it "excludes results that score 0", ->



  describe "scoringFunction", ->
    beforeEach ->
      @friendStruct = # @friendFilter.friendResultToFriendStruct(@fbFriendResult1, "FACEBOOK")
        label: "Yan Zhang"
        meta:
          name: "Yan Zhang"
          uid: "4549"
          provider: "FACEBOOK"
          info: null
    it "returns 0 for non matches", ->
      expect(@friendFilter.scoringFunction "wala", @friendStruct).toBe 0
      expect(@friendFilter.scoringFunction "yank", @friendStruct).toBe 0
    it "returns 1 for single match", ->
      expect(@friendFilter.scoringFunction "ya", @friendStruct).toBe 1
    it "returns 2 for double match", ->
      expect(@friendFilter.scoringFunction "ya zh", @friendStruct).toBe 2
