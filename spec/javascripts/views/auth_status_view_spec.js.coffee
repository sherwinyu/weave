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
          @context.set('facebookAuthed', true)
      it "shows the auth-status-facebook div", ->
        expect(@view.$()).toContain "div.auth-status-facebook"
      it "shows logout link", ->
        expect(@view.$()).toContainText "Logout"
      it "hides Facebook: login link", ->
        expect(@view.$()).not.toContainText "Facebook: Login"
      it "shows the user's canonical_name", ->
        Ember.run =>
          @context.set('user', canonical_name: "Sherwin Yu")
        expect(@view.$()).toContainText "Sherwin Yu"
      it "sends logout event with 'facebook' as argument", ->
        @view.$('#logout-facebook').click()
        expect(@logoutClickedSpy).toHaveBeenCalledOnce()
        expect(@logoutClickedSpy).toHaveBeenCalledWith "facebook"
    describe "facebook: not logged in", ->
      beforeEach ->
        Ember.run =>
          @context.set('facebookAuthed', false)
      it "shows nothing", ->
        expect(@view.$()).not.toContain "div.auth-status-facebook"
