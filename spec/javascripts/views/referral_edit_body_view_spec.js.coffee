describe "ReferralEditBodyView", ->
  beforeEach ->
    @context = Ember.Object.create
      content: "referral content"
      recipient: null
      customizations: []
    @view = Weave.ReferralEditBodyView.create
      controller: @context
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
    expect(@view.$('input')).toHaveValue @context.content

  it "binds referral.content", ->
    @view.$('input').val('new referral content!')
    expect(@view.$('input')).toHaveValue 'new referral content!'
  it "binds referral.customizations", ->
    customizations_select_view = @view.get('childViews')
      .findProperty('constructor', Weave.ReferralCustomizationsSelectView)
    expect(customizations_select_view.get 'customizations').toBe @context.customizations

describe "ReferralCustomizationsSelectView", ->
  beforeEach ->
    @customizations = [
      Ember.Object.create( id: 1, description: "wala1"),
      Ember.Object.create(id: 2, description: "wala2"),
      Ember.Object.create(id: 3, description: "wala3"),
    ]
    @view = Weave.ReferralCustomizationsSelectView.create
      controller: @customizations
      customizations: @customizations
    Ember.run => @view.append()

  it "displays customizations based on context.customizations", ->
    expect(@view.$('.customization').length).toEqual 3
    expect(@view.$('.customization')[0]).toHaveText 'wala1'
    expect(@view.$('.customization')[1]).toHaveText 'wala2'
    expect(@view.$('.customization')[2]).toHaveText 'wala3'
  it "responds to click events", ->
    expect(@customizations.get('0.selected')).toBeFalsy()
    @view.$("input[type='checkbox']").click()
    expect(@customizations.get('0.selected')).toBeTruthy()
