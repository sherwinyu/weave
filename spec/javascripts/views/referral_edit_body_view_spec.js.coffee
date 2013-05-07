describe "ReferralEditBodyView", ->
  beforeEach ->
    @controller = Ember.Object.create
      content: "referral content"
      recipient: null
      customizations: []
    window.view = @view = Weave.ReferralEditBodyView.create
      controller: @controller
    Ember.run =>
      @view.append()

  afterEach ->
    Ember.run => @view.remove()
    @view.destroy()

  describe "structure", ->
    it "contains a referral-content input", ->
      expect(@view.$()).toContain 'input.referral-content'
    it "contains a referral-customizations div", ->
      expect(@view.$()).toContain '.referral-customizations'

  it "prepopulates referral.content", ->
    expect(@view.$('input')).toHaveValue @controller.content

  it "binds referral.content", ->
    @view.$('input').val('new referral content!')
    expect(@view.$('input')).toHaveValue 'new referral content!'
  it "binds referral.customizations", ->
    customizations_select_view = @view.get('childViews')
      .findProperty('constructor', Weave.ReferralCustomizationsSelectView)
    expect(customizations_select_view.get 'customizations').toBe @controller.customizations


