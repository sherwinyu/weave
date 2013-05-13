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
    ).fail (e)-> debugger

  _ajaxOmniauth: (provider)->
    Em.assert 'only supporting facebook right now', provider == 'facebook'
    $.ajax url: Weave.rails().pathHelpers.userOmniauthCallbackPathFacebook

  userAuthenticated: (payload) ->
    user = payload.user
    @get('auths').set 'facebook', user.authorizations[0]

  init: ->
    @_super()
    @set 'auths', Ember.Object.create
      facebook: null
      google: null
