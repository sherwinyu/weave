#= require ./store
#= require_tree ./models
#= require_tree ./controllers
#= require_tree ./views
#= require_tree ./helpers
#= require_tree ./templates
#= require_tree ./routes
#= require ./router
#= require_self


# Initialize Ember routing
if window.ember_params? && !window.location.hash
  window.location.hash = ember_params
