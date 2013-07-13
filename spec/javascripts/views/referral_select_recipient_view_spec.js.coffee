describe "ReferralSelectRecipientView", ->
  beforeEach ->
    # TODO(syu): this should be a referral controller
    @friendFilter = Ember.Object.create
      filterAndRankAgainst: Em.K


    @context = Ember.Object.create
      referralBatch: Ember.Object.create()
      content: "walawala"
      recipient_attributes:
        name: ""
        email: ""
        info:
          uid: ""
          name: ""
          email: ""
          provider: ""
          other_info: null
      friendFilter: @friendFilter
    @view = Weave.ReferralSelectRecipientView.create
      controller: @context

    Ember.run =>
      @view.append()

  afterEach ->
    Ember.run =>
      @view.remove()
      @view.destroy()

  describe "template", ->
    it "contains an input for recipient-name-or-email", ->
      expect(@view.$()).toContain 'input.recipient-name-or-email'
    it "shows a friend-suggestions div if there are displayedFriends", ->
    it "shows a friend-suggestion div for each displayedFriend", ->
    it "shows an image for the friend's picture", ->
    it "shows the friend's name", ->
    it "shows the friend's location", ->

    it 'binds view.query input.recipient-name-or-email', ->
      Ember.run =>
        @view.$('input.recipient-name-or-email').val "new@email.org"
        @view.$('input.recipient-name-or-email').blur()
      expect(@view.get 'query').toBe "new@email.org"
      Ember.run =>
        @view.$('input.recipient-name-or-email').val "firstname last"
        @view.$('input.recipient-name-or-email').blur()
      expect(@view.get 'query').toBe "firstname last"


  describe "bindings", ->
    it "has friendFilter bound to context.friendFilter", ->
      expect(@view.get('friendFilter')).toBe @friendFilter

  describe "didInsertElement", ->
    it "calls initAutocompletion ", ->
      initAutocompletion = sinon.stub @view, 'initAutocompletion'
      @view.didInsertElement()
      expect(initAutocompletion).toHaveBeenCalledOnce()
      initAutocompletion.restore()

  # We're not stubbing this because it's a third party library; need to make sure it works as expected
  describe  "autocompletion ", ->
    beforeEach ->
      @pfriends = new $.Deferred()
      @filterAndRankAgainst = sinon.stub(@friendFilter, "filterAndRankAgainst").returns @pfriends
      @updateDisplayedFriends = sinon.stub @view, "updateDisplayedFriends"

      @friends =  ["list", "of", "friends"]
      @pfriends.resolve @friends
    afterEach ->
      @filterAndRankAgainst.restore()
      @updateDisplayedFriends.restore()

    describe "#source", ->
      beforeEach ->
        request =
          term: "keila"
        response = Em.K
        $('input.recipient-name-or-email').autocomplete('option', 'source').call @, request, response
      it "calls friendFilter.filterAndRankAgainst with the request.term", ->
        expect(@filterAndRankAgainst).toHaveBeenCalledOnce()
        expect(@filterAndRankAgainst).toHaveBeenCalledWith("keila")
      it "takes result of filterAndRankAgainst and calls updateDisplayedFriends", ->
        expect(@updateDisplayedFriends).toHaveBeenCalledOnce()
        expect(@updateDisplayedFriends).toHaveBeenCalledWith(@friends)

  describe "updateDisplayedFriends", ->
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
      @friendStruct2 =
        label: "Janet chien"
        user:
          name: "Janet Chien"
          email: "jchien@gmail.com"

      @friends = [@friendStruct]

      Ember.run =>
        @view.updateDisplayedFriends @friends
    it "sets _rankedFriends to a copy of friends", ->
      friends = @view.get '_rankedFriends'
      expect(friends).toEqual @friends
      expect(friends).not.toBe @friends
      expect(friends[0]).toBe @friendStruct
    it "notifies the _rankedFriends property changed", ->
    it "updates the template #EMBER-INTEGRATION", ->
      expect(@view.$('.friend-suggestion')).toHaveLength 2
      expect(@view.$('.friend-suggestion')).toContainText "Yan Zhang"
      Ember.run =>
        @view.updateDisplayedFriends [ @friendStruct2, @friendStruct ]
      expect(@view.$('.friend-suggestion')).toHaveLength 3
      expect(@view.$('.friend-suggestion')).toContainText "Janet Chien"
      expect(@view.$('.friend-suggestion')).toContainText "Yan Zhang"

