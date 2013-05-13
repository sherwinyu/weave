Weave.AuthenticationController = Ember.Object.extend
  facebookStatus: ""
  auths: null

# public events:
  facebookLoginClicked: ->
    promise = facebook.login().then(
      (success) => @ajaxOmniauth('facebook'),
      (error) => console.log(error)
    )
    @handleOmniauthResponse(promise)

  gmailLoginClicked: ->
    promise = facebook.loginPromise().then(
      (success) => @ajaxOmniauth('gmail'),
      (error) => console.log(error)
    )
############

  _handleOmniauthResponse: (ajax) ->
    ajax.then(
      @userAuthenticated,
      (error) -> console.log(error)
    )

  _ajaxOmniauth: (provier)->
    $.ajax url: Weave.rails().pathHelpers.userOmniauthCallbackPathFacebook

  userAuthenticated: (payload) ->
  init: ->
    @_super()
    @set 'auths', Ember.Object.create
      facebook: null
      google: null
