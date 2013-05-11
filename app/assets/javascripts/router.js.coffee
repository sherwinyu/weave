Weave.Router.map (match)->
  @resource "campaign", path: "/campaigns/:campaign_id", ->
    @resource "referralBatches", path: "/stories", ->
       @route "new"
  @resource "referralBatches", path: "/stories", ->
     @route "new"
  @resource "referralBatch", path: "/stories/:story_id", ->
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

Weave.ReferralBatchesRoute = Ember.Route.extend
  model: (params)->
    console.log "stories id #{params.story_id}"
Weave.ReferralBatchesIndexRoute = Ember.Route.extend()

Weave.ReferralBatchesNewRoute = Ember.Route.extend
  activate: ->
    console.log 'walawala'
    cc = Weave.Campaign.createRecord()
  model: ->

  setupController: (controller, model) ->
    @campaign = @controllerFor('campaign').get 'content'
    @referralBatch = Weave.ReferralBatch.createRecord(campaign: @campaign)
    @referralBatch.save().then(
      ((result) =>
        @transitionTo('referralBatch.show', result)
      ),
      (error) -> console.log('Error occured')
      ).then(null, (error) -> debugger; console.log error)



Weave.ReferralBatchRoute = Ember.Route.extend
  model: (params)->
    console.log "story id #{params.story_id}"
    Weave.ReferralBatch.find params.story_id
  events:
    selectRecipient: ->
      @transitionTo 'referral.select_recipient' #, {referral: {}
    editBody: ->
      @transitionTo 'referral.edit_body'

Weave.ReferralBatchShowRoute = Ember.Route.extend
 wala: 5



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
    Weave.Referral.createRecord(referralBatch: @modelFor('referralBatch'))
  setupController: (controller, model) ->
    debugger
    @controllerFor('referral').set('content', model)
  renderTemplate: ->
    debugger
    @controllerFor('referral').get('myView')?.$('.select-recipient > input').val 'wala'

    # renderTemplate: ->
    # @render 'ReferralSelectRecipient'

Weave.ReferralEditBodyRoute = Ember.Route.extend
  model: (params)->
    console.log "referral id#{params.referal_id}"
    params
