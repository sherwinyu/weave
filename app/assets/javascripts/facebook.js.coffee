jQuery ->
   $('body').prepend('<div id="fb-root"></div>')

   $.ajax
    url: "#{window.location.protocol}//connect.facebook.net/en_US/all.js"
    dataType: 'script'
    cache: 'true'

window.facebook =
  scope: 'email, user_education_history, user_interests, user_likes, user_activities, friends_status, user_status, friends_about_me, friends_activities, friends_education_history, friends_interests, friends_location, friends_religion_politics'
  populateUserInfo: ->

  unwrap: (dfd) ->
    x = null
    dfd.always( (result) -> x = result)
    x

  login: ->
    dfd = new $.Deferred()
    FB.login ((response) ->
      if response.authResponse
        console.log "User did auth"
        dfd.resolve(response)
      else
        console.log "User didn't auth.."
        dfd.reject(response)
    ), scope: facebook.scope
    dfd.promise()

  logout: (cb) ->
    console.log 'FB.logging out'
    FB.getLoginStatus (response) ->
      if response.authResponse
        FB.logout()

  status: ->
    FB.getLoginStatus (response) ->
      console.log "status: ", response

  query: (query) ->
    dfd = new $.Deferred()
    FB.api query, (response) ->
      dfd.resolve(response)
    dfd.promise()

window.fbAsyncInit = ->
  FB.init
    appId: Weave.rails.vars.env.FACEBOOK_APP_ID
    status: true
    cookie: true
    oauth: true

  FB.getLoginStatus (response)-> console.log "FB login status " , response
