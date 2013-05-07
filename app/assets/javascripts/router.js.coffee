Weave.Router.map (match)->
  @resource "stories", path: "/stories", ->
     @route "new"
     # @route "index"
    # @resource "referrals"
  @resource "story", path: "stories/:story_id", ->
    @route "show"
    @resource "referral", path: "referrals/:referral_id", ->
      @route "select_recipient"
      @route "edit_body"
    @route "done"
  @resource "referral", path: "referrals/", ->
    @route "new"

Weave.IndexRoute = Ember.Route.extend
  enter: ->
    console.log 'walawala enter'

Weave.StoriesRoute = Ember.Route.extend
  enter: ->
    console.log 'Stories'
  model: (params)->
    console.log "stories id #{params.story_id}"
Weave.StoriesIndexRoute = Ember.Route.extend
  enter: ->
    console.log 'StoriesIndex'

Weave.StoryRoute = Ember.Route.extend
  enter: ->
    console.log 'Story'
  model: (params)->
    console.log "story id #{params.story_id}"
    params

Weave.ReferralRoute = Ember.Route.extend
  enter: ->
    console.log "wala"
  model: (params)->
    console.log "referral id#{params.referral_id}"
    params

Weave.ReferralIndex = Ember.Route.extend
  enter: ->
    console.log "wala"
  model: (params)->
    console.log "referral id#{params.referal_id}"
    params

Weave.ReferralSelectRecipientRoute = Ember.Route.extend
  enter: ->
    console.log "select_recipient"
  model: (params)->
    console.log "referral id#{params.referal_id}"
    params
  renderTemplate: ->
    @render 'ReferralSelectRecipient'

Weave.ReferralEditBodyRoute = Ember.Route.extend
  enter: ->
    console.log "edit body"
  model: (params)->
    console.log "referral id#{params.referal_id}"
    params
