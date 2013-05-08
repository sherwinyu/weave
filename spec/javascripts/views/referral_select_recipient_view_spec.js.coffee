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
