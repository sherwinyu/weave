Weave.Router.map (match)->
  @resource "products", path: "/products", ->
    @route "selectProduct"

  @resource "product", path: "/products/:product_id", ->
    @resource "campaign", path: "/campaigns/:campaign_id", ->

      @resource "referralBatches", path: "/stories", ->
         @route "new"
         @route "lookup"

  @resource "referralBatch", path: "/stories/:story_id", ->
    @route "show"
    @route "done"

    @resource "referral", path: "/referrals", ->
      @route "select_recipient"
      @route "edit_body", path: "/:referral_id/edit_body"

    @resource "firstReferral", path: "/referrals/first/:referral_id", ->
      @route "select_recipient"
      @route "edit_body"

  @resource "inStore", path: "/inStore", ->
    @resource "referralBatch", path: "/stories/:story_id", ->
      @route "show"
      @route "done"

      @resource "referral", path: "/referrals", ->
        @route "select_recipient"
        @route "edit_body", path: "/:referral_id/edit_body"

      @resource "firstReferral", path: "/referrals/first/:referral_id", ->
        @route "select_recipient"
        @route "edit_body"

  @route 'index', path: '/'
  @route 'otherIndex', path: '*:'

Weave.IndexRoute = Ember.Route.extend
  redirect: ->
    @transitionTo "products.selectProduct"

Weave.OtherIndex = Ember.Route.extend
  redirect: ->
    @transitionTo "products.selectProduct"

Weave.ProductsRoute = Ember.Route.extend()
Weave.ProductsSelectProductRoute = Ember.Route.extend
  model: ->
    Weave.Product.find()
  events:
    startCampaignForProduct: (product)->
      if Weave.rails.isOnlineCampaign()
        ## TODO(syu): figure out actual implementation here
        @transitionTo 'referralBatches.lookup', product, Weave.Campaign.find Weave.rails.vars.campaign_id
      else
        @transitionTo 'referralBatches.new', product, Weave.Campaign.find 1

Weave.CampaignRoute = Ember.Route.extend()

