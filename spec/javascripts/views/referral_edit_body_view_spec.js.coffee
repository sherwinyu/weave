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
    Ember.run =>
      @view.remove()
      @view.destroy()

  describe "structure", ->
    it "contains a referral-content input", ->
      expect(@view.$()).toContain 'input.referral-content'
    it "contains a referral-customizations div", ->
      expect(@view.$()).toContain '.referral-customizations'

  it "prepopulates referral.content", ->
    expect(@view.$('input')).toHaveValue @context.content

  it "binds input.value -> referral.content", ->
    Ember.run =>
      @view.$('input').val('new referral content')
      @view.$('input').blur()
    expect(@context.get 'content').toBe 'new referral content'
  it "binds referral.content -> input.value", ->
    Ember.run =>
      @context.set('content', 'new content')
    expect(@view.$('input')).toHaveValue 'new content'
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

@recipient =
  name: "sherwin yu"
  email: "abc@beg.com"
  meta:
    provider: ["FACEBOOK", "GMAIL", "EMAIL"]
    suggested: true
    other_info: "json"

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
