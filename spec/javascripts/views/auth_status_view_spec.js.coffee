describe "AuthStatusView", ->
  beforeEach ->
    @loginSpy = sinon.spy()
    @context = Ember.Object.create
      auths: Ember.Object.create
        facebook: null
        google: null

    @view = Weave.AuthStatusView.create
      controller: @context

    Ember.run =>
      @view.append()
  afterEach ->
    Ember.run =>
      @view.remove()
      @view.destroy()

  describe "template", ->
    describe "facebook: logged in", ->
      beforeEach ->
        Ember.run =>
          @context.set('auths.facebook', "true")
      it "shows Facebook: logout link", ->
        expect(@view.$()).toContainText "Facebook: Logout"



