describe "ReferralEditBodyView", ->
  beforeEach ->
    @context = Ember.Object.create
      message: "referral message"
      recipient: null
      customizations: []
    @view = Weave.ReferralEditBodyView.create
      controller: @context
    Ember.run =>
      @view.append()

  afterEach ->
    Ember.run =>
      @view.remove()
      @view.destroy()

  describe "structure", ->
    it "contains a referral-message input", ->
      expect(@view.$()).toContain 'textarea.referral-message'
    it "contains a referral-customizations div", ->
      expect(@view.$()).toContain '.referral-customizations'
    it "contains a primary deliver button", ->
      expect(@view.$()).toContain '.btn.btn-primary#deliver-button'

  it "prepopulates referral.message", ->
    expect(@view.$('textarea.referral-message')).toHaveValue @context.message

  it "binds input.value -> referral.message", ->
    Ember.run =>
      @view.$('textarea.referral-message').val('new referral message')
      @view.$('textarea.referral-message').blur()
    expect(@context.get 'message').toBe 'new referral message'
  it "binds referral.message -> input.value", ->
    Ember.run =>
      @context.set('message', 'new message')
    expect(@view.$('textarea.referral-message')).toHaveValue 'new message'
  it "binds referral.customizations", ->
    customizations_select_view = @view.get('childViews')
      .findProperty('constructor', Weave.ReferralCustomizationsSelectView)
    expect(customizations_select_view.get 'customizations').toBe @context.customizations

