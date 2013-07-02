Weave.AuthenticationController = Ember.ObjectController.extend
  needs: "referral"
  user: null
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
    $.ajax url: Weave.rails.vars.pathHelpers.userOmniauthCallbackPathFacebook

  userAuthenticated: (payload) ->
    Ember.assert "User shouldnt already exist", !@get('user')?
    user = Weave.User.loadFromJson payload
    @set 'user', user

    # TODO (syu): allow gmail and not dependant on 0th index
    @get('auths').set 'facebook', payload.user.authorizations[0]

    @get('target').send 'facebookAuthenticated'
    user

  logout: ->
    FB.logout()
    @controllerFor('application').pushSuccessNotification "Successfully logged out of Facebook"
    p = utils.delete url: Weave.rails.vars.pathHelpers.destroyUserSessionPath
    @get('controllers.referral.friendFilter').clearCache()
    @set 'user', null
    @set 'auths.facebook', null
    @set 'auths.google', null
    p.then ->
      utils.delayed 2000, ->
        window.location.href = "/"





  init: ->
    @_super()
    @set 'auths', Ember.Object.create
      facebook: null
      google: null
