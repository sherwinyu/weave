describe "AuthStatusView", ->
  beforeEach ->
    @loginClickedSpy = sinon.spy()
    @logoutClickedSpy = sinon.spy()
    @context = Ember.Object.create
      auths: Ember.Object.create
        facebook: null
        google: null
      loginClicked: @loginClickedSpy
      logoutClicked: @logoutClickedSpy

    @view = Weave.AuthStatusView.create
      controller: @context

    Ember.run =>
      @view.append()
  afterEach ->
    Ember.run =>
      @view.remove()
      @view.destroy()

  describe "template", ->
    describe "facebook: already logged in", ->
      beforeEach ->
        Ember.run =>
          @context.set('auths.facebook', "true")
      it "shows Facebook: logout link", ->
        expect(@view.$()).toContainText "Facebook: Logout"
      it "shows hides Facebook: login link", ->
        expect(@view.$()).not.toContainText "Facebook: Login"
      it "sends login event with 'facebook' as argument", ->
        @view.$('#logout-facebook').click()
        expect(@logoutClickedSpy).toHaveBeenCalledOnce()
        expect(@logoutClickedSpy).toHaveBeenCalledWith "facebook"


    describe "facebook: already logged out", ->
      beforeEach ->
        Ember.run =>
          @context.set('auths.facebook', false)
      it "shows Facebook: login link", ->
        expect(@view.$()).toContainText "Facebook: Login"
      it "hides Facebook: logout link", ->
        expect(@view.$()).not.toContainText "Facebook: Logout"
      it "sends loginClicked event with 'facebook' as argument", ->
        @view.$('#login-facebook').click()
        expect(@loginClickedSpy).toHaveBeenCalledOnce()
        expect(@loginClickedSpy).toHaveBeenCalledWith "facebook"
