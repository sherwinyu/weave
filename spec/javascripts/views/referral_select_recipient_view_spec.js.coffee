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
      @filterAndRankAgainst = sinon.stub(@friendFilter, "filterAndRankAgainst").returns new $.Deferred()
    afterEach ->
      @filterAndRankAgainst.restore()

    it "calls friendFilter.filterAndRankAgainst with the request.term", ->
      request =
        term: "keila"
      response = Em.K
      $('input.recipient-name-or-email').autocomplete('option', 'source').call @, request, response
      expect(@filterAndRankAgainst).toHaveBeenCalledOnce()
      expect(@filterAndRankAgainst).toHaveBeenCalledWith("keila")

