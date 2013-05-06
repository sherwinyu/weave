Weave.Router.map (match)->
  @route "index", path: "/"
  @resource "stories", path: "/stories", ->
     @route "new"
     # @route "index"
    # @resource "referrals"
  @resource "story", path: "stories/:story_id", ->
    @route "show"

Weave.IndexRoute = Ember.Route.extend
  enter: ->
    console.log 'walawala enter'

Weave.StoriesRoute = Ember.Route.extend
  enter: ->
    console.log 'walawala rrb route'
Weave.StoriesIndexRoute = Ember.Route.extend
  enter: ->
    console.log 'walawala rbindex route'


Weave.StoryRoute = Ember.Route.extend
  enter: ->
    console.log 'walawala rbindex route'
  model: (params)->
    params.story_id
    params
Weave.StoryShowRoute = Ember.Route.extend
  enter: -> 
    console.log ' wala wala!!! '
