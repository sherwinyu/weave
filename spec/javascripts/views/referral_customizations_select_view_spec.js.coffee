describe "ReferralCustomizationsSelectView", ->
  beforeEach ->
    @availableCustomizations = [
      Ember.Object.create( id: 1, description: "Buy this product because it's so green"),
      Ember.Object.create(id: 2, description: "wala2"),
      Ember.Object.create(id: 3, description: "wala3"),
    ]
    @context = {}

    @view = Weave.ReferralCustomizationsSelectView.create
      controller: @context
      availableCustomizations: @availableCustomizations

    Ember.run => @view.append()

  afterEach ->
    Ember.run =>
      @view.remove()
      @view.destroy()

  describe "template", ->
    it "displays one customization div per customization", ->
      expect(@view.$('div.customization .checkbox.customization').length).toEqual 3
    describe "single customization:", ->
      it "displays the correct text", ->
        expect(@view.$('div.customization')[0]).toHaveText "Buy this product because it's so green"
      it "wraps the checkbox in a label", ->
        expect(@view.$('div.customization .checkbox.customization')[0]).toContain 'input[type=checkbox]'
      describe "selection indicator", ->
        it "is span.customization-selection-indicator", ->
          expect(@view.$('div.customization ')[0]).toContain 'span.customization-selection-indicator'
        it "binds customization.selected", ->
          expect(@view.$('div.customization ')[0]).not.toContain 'span.customization-selection-indicator.selected'
          Ember.run => @availableCustomizations[0].set('selected', true)
          expect(@view.$('div.customization ')[0]).toContain 'span.customization-selection-indicator.selected'
      it "responds to click events", ->
        expect(@availableCustomizations.get('0.selected')).toBeFalsy()
        Ember.run =>
          @view.$("label.checkbox.customization").first().click()
        expect(@availableCustomizations.get('0.selected')).toBeTruthy()


  xit "displays customizations based on context.customizations", ->
    debugger
    expect(@view.$('div.customization').length).toEqual 3
    expect(@view.$('.customization')[0]).toHaveText 'wala1'
    expect(@view.$('.customization')[1]).toHaveText 'wala2'
    expect(@view.$('.customization')[2]).toHaveText 'wala3'

  it "responds to click events", ->

recipient =
  name: "sherwin yu"
  email: "abc@beg.com"
  meta:
    provider: ["FACEBOOK", "GMAIL", "EMAIL"]
    suggested: true
    other_info: "json"
