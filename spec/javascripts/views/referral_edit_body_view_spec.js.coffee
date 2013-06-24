describe "ReferralEditBodyView", ->
  beforeEach ->
    @oldWeaveView = Weave.ReferralCustomizationsSelectView
    Weave.ReferralCustomizationsSelectView = Ember.View.extend()

    @context = Ember.Object.create
      message: "referral message"
      recipient: null
      customizations: ['customization1' ]
      availableCustomizations: ['customization1', 'customization2', 'customization3']
      recipientFirstName: "Sherwin"
    @view = Weave.ReferralEditBodyView.create
      controller: @context
    Ember.run =>
      @view.append()

  afterEach ->
    Ember.run =>
      @view.remove()
      @view.destroy()
    Weave.ReferralCustomizationsSelectView = @oldWeaveView

  describe "template: ", ->
    describe "instructions for personalizing your referral", ->
      it "contains a h4.step-subheader", ->
        expect(@view.$()).toContain 'h4.step-subheader'
      it "binds to recipientFirstName", ->
        expect(@view.$('h4.step-subheader')).toHaveText /Personalize your referral by adding a short message.*Sherwin/
        Ember.run =>
          @context.set 'recipientFirstName', 'Hannah'
        expect(@view.$('h4.step-subheader')).toHaveText /Personalize your referral by adding a short message.*Hannah/
    describe "referral message area", ->
      it "contains textarea.referral-message", ->
        expect(@view.$()).toContain 'textarea.referral-message'
      it "binds input.value -> referral.message", ->
        Ember.run =>
          @view.$('textarea.referral-message').val('new referral message')
          @view.$('textarea.referral-message').blur()
        expect(@context.get 'message').toBe 'new referral message'
      it "binds referral.message -> input.value", ->
        Ember.run =>
          @context.set('message', 'new message')
        expect(@view.$('textarea.referral-message')).toHaveValue 'new message'
    describe "customizations area", ->
      it "has instructions for customizations", ->
        expect(@view.$('.step-subheader')).toHaveText /Select a few of the following.*Sherwin.*/
    describe "recipient email address area", ->
      xit "contains textarea.referral-message", ->
        expect(@view.$()).toContain 'textarea.referral-message'
      xit "binds input.value -> referral.message", ->
        Ember.run =>
          @view.$('textarea.referral-message').val('new referral message')
          @view.$('textarea.referral-message').blur()
        expect(@context.get 'message').toBe 'new referral message'
      xit "binds referral.message -> input.value", ->
        Ember.run =>
          @context.set('message', 'new message')
        expect(@view.$('textarea.referral-message')).toHaveValue 'new message'
    describe "send button", ->
      it "has css a#deliver-button.deliver-button", ->
        expect(@view.$()).toContain '#deliver-button.deliver-button'
      it "has text SEND!", ->
        expect(@view.$('#deliver-button.deliver-button')).toHaveText /SEND!/
      it "sends deliverClicked event with context as argument when clicked", ->
        deliverClicked = sinon.spy()
        @context.set('deliverClicked', deliverClicked)
        @view.$('#deliver-button.deliver-button').click()
        expect(deliverClicked).toHaveBeenCalledOnce()
        expect(deliverClicked).toHaveBeenCalledWith(@context)

  describe "child view: ReferralCustomizationsSelectView", ->
    beforeEach ->
      @customizationsSelectView = @view.get('childViews')
        .findProperty('constructor', Weave.ReferralCustomizationsSelectView)
    afterEach ->
      @customizationsSelectView = null

    it "binds context.customizations", ->
      expect(@customizationsSelectView.get 'customizations').toBe @context.get 'customizations'

    it "binds context.availableCustomizations", ->
      expect(@customizationsSelectView.get 'availableCustomizations').toBe @context.get 'availableCustomizations'
