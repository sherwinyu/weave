Weave.Router.map (match)->
  @resource "products", path: "/products", ->
    @route "selectProduct"
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
Weave.ProductsRoute = Ember.Route.extend
  model: ->
    Weave.Product.find()
Weave.ProductsSelectProduct = Ember.Route.extend()

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
      )

Weave.ReferralBatchRoute = Ember.Route.extend
  model: (params)->
    Weave.ReferralBatch.find params.story_id
  events:
    startReferring: ->
      @controllerFor('referral').set 'firstReferralSent', false
      @transitionTo 'referral.select_recipient' #, {referral: {}
    startNewReferral: ->
      @controllerFor('referral').set 'firstReferralSent', true
      @transitionTo 'referral.select_recipient' #, {referral: {}
  renderTemplate: ->
    @_super()

Weave.ReferralBatchShowRoute = Ember.Route.extend
  wala: 5

Weave.ReferralRoute = Ember.Route.extend
  events:
    selectRecipient: ->
      @transitionTo 'referral.select_recipient' #, {referral: {}
    editBody: (referral)->
      @transitionTo 'referral.edit_body', referral
  renderTemplate: ->
    @_super()



Weave.ReferralSelectRecipientRoute = Ember.Route.extend
  model: (params)->
    console.log "referral id#{params.referal_id}"
    Weave.Referral.createRecord(referralBatch: @modelFor('referralBatch'))
  setupController: (controller, model) ->
    @controllerFor('referral').set('content', model)
    @controllerFor('referral').set 'message', "Enter your content here"
    @controllerFor('referral').set('selectingRecipient', true)
    Ember.run.sync()

  renderTemplate: ->
    if @controllerFor('referral').get('firstReferralSent')
      @render 'referralBatchDone',
        outlet: 'addendum'
        into: 'referralBatch'
        controller: 'referralBatch'
    @controllerFor('referral').get('myView')?.$('.select-recipient > input').val 'wala'

  deactivate: ->
    @controllerFor('referral').set('selectingRecipient', false)

  events:
    recipientSelected: ->
      @modelFor('referral.select_recipient').one 'didCreate', =>
        Ember.run.next @, =>
          rf = @controllerFor('referral').get 'content'
          # rf.get('stateManager').send('finishedMaterializing')
          @send 'editBody', rf
      @controllerFor('referral').createWithRecipient()

Weave.ReferralEditBodyRoute = Ember.Route.extend
  redirect: (model) ->
    @transitionTo 'referral.select_recipient' unless model?.get('id')

  setupController: (controller, model) ->
    @controllerFor('referral').set('content', model)
    @controllerFor('referral').set('editingBody', true)
  deactivate: ->
    @controllerFor('referral').set('editingBody', false)
  events:
    deliverClicked: (referral) ->
      @controllerFor('referral').get('content').one 'didUpdate', =>
        @send 'startNewReferral'
      @controllerFor('referral').updateAndDeliver()

      renderTemplate: ->
