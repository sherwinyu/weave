Weave.Router.map (match)->
  @route "index", path: "/"
  @resource "stories",  ->
     @route "new"
     @route "index"
    # @resource "referrals"
  @resource 'posts', ->
    @route 'new'
Weave.IndexRoute = Ember.Route.extend
  enter: ->
    console.log 'walawala enter'

Weave.StoriesRoute = Ember.Route.extend
  enter: ->
    console.log 'walawala rrb route'
Weave.StoriesIndexRoute = Ember.Route.extend
  enter: ->
    console.log 'walawala rbindex route'
  # match('/').to('index')

