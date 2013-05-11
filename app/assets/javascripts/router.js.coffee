Weave.Router.map (match)->
  @resource "campaign", path: "/campaigns/:campaign_id", ->
    @resource "referralBatches", path: "/stories", ->
       @route "new"
  @resource "referralBatches", path: "/stories", ->
     @route "new"
  @resource "referralBatch", path: "/stories/:story_id", ->
    @route "show"
    @resource "referral", path: "/referrals", ->
      @route "select_recipient"
      @route "edit_body", path: "/:referral_id/edit_body"
      @resource "referralx", path: "/:referral_id", ->
        @route "edit_body"
    ###
    @resource "referral", path: "/referrals/:referral_id", ->
      @route "select_recipient"
      @route "edit_body"
    ###
    @resource "firstReferral", path: "/referrals/first/:referral_id", ->
      @route "select_recipient"
      @route "edit_body"
    @route "done"
  ###
  @resource "referral", path: "/referrals", ->
    @route "new"
  ###
Weave.CampaignRoute = Ember.Route.extend()
Weave.IndexRoute = Ember.Route.extend()
Weave.ReferralBatchesRoute = Ember.Route.extend()
Weave.ReferralBatchesNewRoute = Ember.Route.extend
  activate: ->
    console.log 'walawala'
    cc = Weave.Campaign.createRecord()
  model: ->

  #TODO(syu): TEST ME
  setupController: (controller, model) ->
    @campaign = @modelFor('campaign')
    @referralBatch = Weave.ReferralBatch.createRecord(campaign: @campaign)
    @referralBatch.save().then(
      ((result) =>
        @transitionTo('referralBatch.show', result)
      ),
      (error) -> console.log('Error occured')
      ).then(null, (error) -> debugger; console.log error)

Weave.ReferralBatchRoute = Ember.Route.extend
  model: (params)->
    Weave.ReferralBatch.find params.story_id
  events:
    startReferring: ->
      @transitionTo 'referral.select_recipient' #, {referral: {}

Weave.ReferralBatchShowRoute = Ember.Route.extend
  wala: 5

Weave.ReferralRoute = Ember.Route.extend
  events:
    selectRecipient: ->
      @transitionTo 'referral.select_recipient' #, {referral: {}
    editBody: (referral)->
      @transitionTo 'referral.edit_body', referral

Weave.ReferralSelectRecipientRoute = Ember.Route.extend
  model: (params)->
    console.log "referral id#{params.referal_id}"
    Weave.Referral.createRecord(referralBatch: @modelFor('referralBatch'))
  setupController: (controller, model) ->
    @controllerFor('referral').set('content', model)
    @controllerFor('referral').set('selectingRecipient', true)
  renderTemplate: ->
    @controllerFor('referral').get('myView')?.$('.select-recipient > input').val 'wala'
  deactivate: ->
    @controllerFor('referral').set('selectingRecipient', false)


    # renderTemplate: ->
    # @render 'ReferralSelectRecipient'

Weave.ReferralEditBodyRoute = Ember.Route.extend
  redirect: (model) ->
    @transitionTo 'referral.select_recipient' unless model?

  setupController: (controller, model) ->
    @controllerFor('referral').set('content', model)
    @controllerFor('referral').set('editingBody', true)
  deactivate: ->
    @controllerFor('referral').set('editingBody', false)
