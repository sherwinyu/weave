Weave.AuthenticationController = Ember.Object.extend
  facebookStatus: ""
  auths: null
  omniauthed: (->
    !!auths.get('facebook')
  )

# public events:
  facebookLoginClicked: ->
    promise = facebook.login().then(
      (success) => @_ajaxOmniauth('facebook'),
      (error) => console.log(error)
    )
    @_handleOmniauthResponse(promise)

  gmailLoginClicked: ->
    promise = facebook.loginPromise().then(
      (success) => @ajaxOmniauth('gmail'),
      (error) => console.log(error)
    )
############

  _handleOmniauthResponse: (ajax) ->
    ajax.then(
      (payload) => @userAuthenticated(payload),
      (error) -> console.log(error)
    ).fail (e)-> debugger

  _ajaxOmniauth: (provier)->
    $.ajax url: Weave.rails().pathHelpers.userOmniauthCallbackPathFacebook

  userAuthenticated: (payload) ->
    user = payload.user
    @get('auths').set 'facebook', user.authorizations[0]

  init: ->
    @_super()
    @set 'auths', Ember.Object.create
      facebook: null
      google: null
