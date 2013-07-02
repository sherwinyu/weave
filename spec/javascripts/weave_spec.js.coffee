describe "Weave.rails", ->
  beforeEach ->
    window._rails =
      pathHelpers:
        urlOmniauthCallbackPathFacebook: 'wagawaga'
        destroyUserSessionPath: 'wagawaga'
      path: "products/selectProduct"
      current_user: {}
      env: {
        FACEBOOK_APP_ID: "12345"
      }
      landing_email: "waga@gmail.com"
    Weave.initRails()

  afterEach ->
    delete window._rails
  describe ".isOnlineCampaign()", ->
    it "returns true if landing_email is set", ->
      window._rails.landing_email = null
      expect(Weave.rails.isOnlineCampaign()).toBeFalsy()
      ###
    @rails = {
      pathHelpers: {
        userOmniauthCallbackPathFacebook: user_omniauth_callback_path(:facebook),
        destroyUserSessionPath: destroy_user_session_path
      },
      path: request.path || "products/selectProduct",
      current_user: current_user && current_user.active_model_serializer.new(current_user).to_json,
      env: {
        FACEBOOK_APP_ID: Figaro.env.FACEBOOK_APP_ID
      },
      landing_email: params[:landing_email]
    }
      ###

