#= require ./store
#= require_tree ./utils
#= require_tree ./models
# require_tree ./controllers
# require_tree ./views
#= require_tree ./helpers
#= require_tree ./templates
#= require_tree ./routes
#= require ./router
#= require_self


Weave.rails = -> window._rails
# Initialize Ember routing
if Weave.rails()?.path? && !window.location.hash
  window.location.hash = Weave.rails.path

Weave.register('friendFilter:main', Weave.FriendFilter)

Weave.inject('controller:referral', 'friendFilter', 'friendFilter:main')

Weave.register('controller:authentication', Weave.AuthenticationController)
Weave.inject('friendFilter', 'auth', 'controller:authentication')
