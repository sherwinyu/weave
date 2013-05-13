#= require ./store
#= require_tree ./utils
#= require_tree ./models
#= require_tree ./controllers
#= require_tree ./views
#= require_tree ./helpers
#= require_tree ./templates
#= require_tree ./routes
#= require ./router
#= require_self


Weave.rails = -> window._rails
# Initialize Ember routing
if Weave.rails()?.path? && !window.location.hash
  window.location.hash = Weave.rails.path
