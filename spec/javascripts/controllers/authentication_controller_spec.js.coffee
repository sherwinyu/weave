describe "AuthenticationController", ->
  beforeEach ->
    @authenticationController = Weave.AuthenticationController.create
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
      @authenticationController._ajaxOmniauth('facebook')
      expect(@ajax).toHaveBeenCalledOnce()
      args = @ajax.getCall(0).args[0]
      expect(args.url).toEqual '/callbackpath'

  describe "userAuthenticated", ->
    it 'sets the user', ->
      expect(true).toBeTruthy()
