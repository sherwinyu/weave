describe "ReferralEditBodyView", ->
  beforeEach ->
    debugger
    @controller = Ember.Object.create
      content: "referral content"
      recipient: null
      customizations: []
    window.view = @view = Weave.ReferralEditBodyView.create
      controller: @controller

    Ember.run =>
      @view.append()
    debugger
    # afterEach ->
    # Ember.run => @view.remove()
    # @view.destroy()
  it "should bind referral.content", ->
    expect(@view.$('input')).toHaveValue @controller.content


