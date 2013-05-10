Weave.Router.map (match)->
  @resource "campaign", path: "/campaigns/:campaign_id", ->
    @resource "stories", path: "/stories", ->
       @route "new"
  @resource "stories", path: "/stories", ->
     @route "new"
  @resource "story", path: "/stories/:story_id", ->
    @route "show"
    @resource "referral", path: "/referrals/:referral_id", ->
      @route "select_recipient"
      @route "edit_body"
    @resource "firstReferral", path: "/referrals/first/:referral_id", ->
      @route "select_recipient"
      @route "edit_body"
    @route "done"
  @resource "referral", path: "/referrals", ->
    @route "new"
Weave.CampaignRoute = Ember.Route.extend()

Weave.IndexRoute = Ember.Route.extend()

Weave.StoriesRoute = Ember.Route.extend
  model: (params)->
    console.log "stories id #{params.story_id}"
Weave.StoriesIndexRoute = Ember.Route.extend()

Weave.StoryRoute = Ember.Route.extend
  model: (params)->
    console.log "story id #{params.story_id}"
    params
  events:
    selectRecipient: ->
      @transitionTo 'referral.select_recipient' #, {referral: {}
    editBody: ->
      @transitionTo 'referral.edit_body'
Weave.FirstReferralRoute = Ember.Route.extend
  model: (params) ->
    console.log "first referral id#{params.referral_id}"
    params

Weave.ReferralRoute = Ember.Route.extend
  model: (params)->
    console.log "referral id#{params.referral_id}"
    params
  events:
    selectRecipient: ->
      @transitionTo 'referral.select_recipient' #, {referral: {}
    editBody: ->
      @transitionTo 'referral.edit_body'

Weave.ReferralIndex = Ember.Route.extend
  model: (params)->
    console.log "referral id#{params.referal_id}"
    params

Weave.ReferralSelectRecipientRoute = Ember.Route.extend
  model: (params)->
    console.log "referral id#{params.referal_id}"
    params
  renderTemplate: ->
    debugger
    @controllerFor('referral').get('myView')?.$('.select-recipient > input').val 'wala'

    # renderTemplate: ->
    # @render 'ReferralSelectRecipient'

Weave.ReferralEditBodyRoute = Ember.Route.extend
  model: (params)->
    console.log "referral id#{params.referal_id}"
    params
