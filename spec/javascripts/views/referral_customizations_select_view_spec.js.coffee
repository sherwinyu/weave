describe "ReferralCustomizationsSelectView", ->
  beforeEach ->
    @customizations = [
      Ember.Object.create( id: 1, description: "wala1"),
      Ember.Object.create(id: 2, description: "wala2"),
      Ember.Object.create(id: 3, description: "wala3"),
    ]
    @context =
      availableCustomizations: @customizations

    @view = Weave.ReferralCustomizationsSelectView.create context: @context
    Ember.run => @view.append()

  afterEach ->
    Ember.run =>
      @view.remove()
      @view.destroy()

  it "displays customizations based on context.customizations", ->
    expect(@view.$('.customization').length).toEqual 3
    expect(@view.$('.customization')[0]).toHaveText 'wala1'
    expect(@view.$('.customization')[1]).toHaveText 'wala2'
    expect(@view.$('.customization')[2]).toHaveText 'wala3'

  it "responds to click events", ->
    expect(@customizations.get('0.selected')).toBeFalsy()
    @view.$("input[type='checkbox']").click()
    expect(@customizations.get('0.selected')).toBeTruthy()

recipient =
  name: "sherwin yu"
  email: "abc@beg.com"
  meta:
    provider: ["FACEBOOK", "GMAIL", "EMAIL"]
    suggested: true
    other_info: "json"
