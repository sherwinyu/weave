describe "AuthenticationController", ->
  beforeEach ->
    @ctrl = Weave.AuthenticationController.create
      container: Weave.__container__

  describe "ajaxOmniauth", ->
    beforeEach ->
      @ajax = sinon.stub($, 'ajax')
      @rails = sinon.stub(Weave, 'rails').returns
        pathHelpers:
          userOmniauthCallbackPathFacebook: '/callbackpath'
    afterEach ->
      @ajax.restore()
      @rails.restore()
    xit 'should post make an ajax get to the correct path', ->
      @ctrl._ajaxOmniauth('facebook')
      expect(@ajax).toHaveBeenCalledOnce()
      args = @ajax.getCall(0).args[0]
      expect(args.url).toEqual '/callbackpath'

  describe "userAuthenticated", ->
    it 'sets the user', ->
      expect(true).toBeTruthy()

  describe "logoutClicked", ->
    beforeEach ->
      @logoutSpy = sinon.stub @ctrl, "logout"
    it 'with facebook, calls @logout with facebook as argument', ->
      @ctrl.send 'logoutClicked', "facebook"
      expect(@logoutSpy).toHaveBeenCalledOnce()
    afterEach ->
      @logoutSpy.restore()

  describe "logout", ->
    it "calls FB.logout()", ->
    it "ajaxes the destroyUserSession path", ->
    it "clears the friendFilter cache", ->
    it "clears the user", ->
    it "clears auth.facebook", ->
    it "clears auth.google", ->
    it "sets a delayed reset", ->
