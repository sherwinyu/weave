#= require ./store
#= require_tree ./utils
#= require ./weave_model.js.coffee
#= require_tree ./models
#= require_tree ./controllers
#= require_tree ./views
#= require_tree ./helpers
#= require_tree ./templates
#= require_tree ./routes
#= require ./router
#= require_self

do (Weave.initRails = ->
  Weave.rails =
    vars: window._rails
    isOnlineCampaign: ->
      Weave.rails.vars.landing_email?
)

# Initialize Ember routing
if Weave.rails?.vars?.path? && !window.location.hash
  window.location.hash = Weave.rails.vars.path || "products/selectProduct"

Weave.register('friendFilter:main', Weave.FriendFilter)

Weave.inject('controller:referral', 'friendFilter', 'friendFilter:main')

Weave.register('controller:authentication', Weave.AuthenticationController)

# Next two registrations needed for copy controller
Weave.register('controller:product', Weave.ProductController)
Weave.register('controller:campaign', Weave.CampaignController)
Weave.register('manager:copy', Weave.CopyController)

Weave.inject('friendFilter', 'auth', 'controller:authentication')
Weave.inject('model', 'applicationController', 'controller:application')

# Weave.inject('controller:application', 'copy', 'controller:copy')
# Weave.inject('controller:*', 'copy', 'controller:copy')
Weave.inject('controller', 'copy', 'manager:copy')
# Weave.inject('controller:', 'copy', 'manager:copy')
