describe "ReferralSelectRecipientView", ->
  beforeEach ->
    # TODO(syu): this should be a referral controller
    @referralContext = Ember.Object.create
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
    @view = Weave.ReferralSelectRecipientView.create
      controller: @referralContext

    Ember.run => @view.append()

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

  describe "didInsertElement", ->
    it "sets friendFilter to the controller's friendFilter", ->
      get = sinon.spy @view, 'get'
      friendFilter = Ember.Object.create()
      get.calledWith('context.friendFilter').returns friendFilter
      @view.didInsertElement()
      expect(get).toHaveBeenCalledWith('context.friendFilter')
      expect(@view.get('friendFilter')).toBe friendFilter
      get.restore()

    it "calls initAutocompletion ", ->
      initAutocompletion = sinon.stub @view, 'initAutocompletion'
      @view.didInsertElement()
      expect(initAutocompletion).toHaveBeenCalledOnce()


  # We're not stubbing this because it's a third party library; need to make sure it works as expected
  describe  "bindAutocompletion", ->
    expect(false).toBe true


  xit 'binds input#value to recipient.email', ->
    Ember.run =>
      @view.$('input.recipient-name-or-email').val "new@email.org"
      @view.$('input.recipient-name-or-email').blur()
    expect(@context.get 'email').toBe "new@email.org"

  xit 'binds recipient.email to input#value', ->
    Ember.run =>
      @context.set 'email', 'new@email.org'
    expect(@view.$('input.recipient-name-or-email')).toHaveValue "new@email.org"
