describe "ReferralBatchShowView", ->
  beforeEach ->
    @send = sinon.stub()

    @context = Ember.Object.create
      send: @send
    @view = Weave.ReferralBatchShowView.create
      controller: @context
    Ember.run =>
      @view.append()
  afterEach ->
    Ember.run =>
      @view.remove()
      @view.destroy()
  describe "template: ", ->
    it "contains a login-options div", ->
      expect(@view.$()).toContain 'div.login-options'
    describe "login-options div", ->
      it "contains 'div.new-auth'", ->
        expect(@view.$('div.login-options')).toContain 'div.new-auth'
    describe "new-auth area", ->
      it "contains sender-name field", ->
        expect(@view.$('div.new-auth input#sender-name')).toExist()
      it "contains sender-email field", ->
        expect(@view.$('div.new-auth input#sender-email')).toExist()
      it "initially hides the new-auth-fields", ->
        expect(@view.$('#new-auth-fields')).toHaveClass('collapse')
        expect(@view.$('#new-auth-fields')).not.toHaveClass('in')
      it "becomes visible when Share with your friends is clicked", ->
        expect(@view.$('.new-auth a.btn-authenticate.btn.start-sharing')).toExist()
        ###
        Ember.run =>
          @view.$('.new-auth btn-authenticate.btn.start-sharing').click()
        expect(@view.$('#new-auth-fields')).toHaveClass('collapse')
        expect(@view.$('#new-auth-fields')).toHaveClass('in')
        ###
    describe "invalid email binding", ->
      it "is hidden by default", ->
        expect(@view.$('.invalid-helper.email')).not.toHaveClass 'invalid'
      it "is shown when view._invalidEmail is true", ->
        Ember.run => @view.set('_invalidEmail', true)
        expect(@view.$('.invalid-helper.email')).toHaveClass 'invalid'
        expect(@view.$('input#sender-email')).toHaveClass 'invalid'

  describe "share button", ->
    beforeEach ->
      @shareClicked = sinon.spy(@view, "shareClicked")
    afterEach ->
      @shareClicked.restore()
    it "is in the template", ->
      expect(@view.$('#share-now')).toExist()

    it "triggers event shareClicked", ->
      @view.$('#sender-name').val 'sherwin yu'
      @view.$('#sender-name').blur()
      @view.$('#sender-email').val 'sherwin.yu@example.com'
      @view.$('#sender-email').blur()
      @view.$('#share-now').click()
      expect(@shareClicked).toHaveBeenCalled()
      expect(@shareClicked).toHaveBeenCalledWith( 'sherwin yu', 'sherwin.yu@example.com')
  describe "shareClicked", ->
    describe "when clicked with valid email", ->
      it "sends attemptAuthNoFacebook with the name and email", ->
        Ember.run =>
          @view.shareClicked('sherwin yu', 'sherwin.yu@example.com')
        expect(@send).toHaveBeenCalledOnce()
        expect(@send).toHaveBeenCalledWith 'attemptAuthNoFacebook', 'sherwin yu', 'sherwin.yu@example.com'

    describe "when clicked with invalid email", ->
      it "sends attemptAuthNoFacebook with the name and email", ->
        Ember.run =>
          @view.shareClicked('sherwin yu', 'notarealemail')
        expect(@send).not.toHaveBeenCalled()
        expect(@view.get('_invalidEmail')).toBeTruthy()
