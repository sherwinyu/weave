Weave.AuthenticationController = Ember.Object.extend
  facebookStatus: ""
  auths: null
  omniauthed: (->
    !!@get('auths.facebook')
  ).property( 'auths.facebook', 'auths.gmail')

# public events:
  facebookLogin: ->
    promise = facebook.login().then(
      (success) => @_ajaxOmniauth('facebook'),
      (error) => console.log(error)
    )
    @_handleOmniauthResponse(promise)

  gmailLogin: ->
    promise = facebook.login().then(
      (success) => @ajaxOmniauth('gmail'),
      (error) => console.log(error)
    )
    @_handleOmniauthResponse(promise)
############

  _handleOmniauthResponse: (ajax) ->
    ajax.then(
      (payload) => @userAuthenticated(payload),
      (error) -> console.log(error)
    )

  _ajaxOmniauth: (provider)->
    Em.assert 'only supporting facebook right now', provider == 'facebook'
    $.ajax url: Weave.rails().pathHelpers.userOmniauthCallbackPathFacebook

  userAuthenticated: (payload) ->
    user = payload.user
    @set 'user', user
    # TODO (syu): allow gmail
    @get('auths').set 'facebook', user.authorizations[0]
    user

  init: ->
    @_super()
    @set 'auths', Ember.Object.create
      facebook: null
      google: null
