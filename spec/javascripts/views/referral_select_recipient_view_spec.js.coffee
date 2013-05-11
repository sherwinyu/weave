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
      recipient: @context
    Ember.run => @view.append()

  afterEach ->
    Ember.run =>
      @view.remove()
      @view.destroy()

  describe "structure", ->
    it "contains an input for name or email", ->
      expect(@view.$()).toContain 'input.recipient-name-or-email'
  xit 'binds input#value to recipient.email', ->
    Ember.run =>
      @view.$('input.recipient-name-or-email').val "new@email.org"
      @view.$('input.recipient-name-or-email').blur()
    expect(@context.get 'email').toBe "new@email.org"

  xit 'binds recipient.email to input#value', ->
    Ember.run =>
      @context.set 'email', 'new@email.org'
    expect(@view.$('input.recipient-name-or-email')).toHaveValue "new@email.org"
