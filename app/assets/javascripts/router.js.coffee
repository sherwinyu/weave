Weave.Router.map (match)->
  @resource "products", path: "/products", ->
    @route "selectProduct"

  @resource "campaign", path: "/campaigns/:campaign_id", ->

    @resource "referralBatches", path: "/stories", ->
       @route "new"


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

  @route 'index', path: '*:'

Weave.IndexRoute = Ember.Route.extend
  redirect: ->
    @transitionTo "products.selectProduct"

Weave.ProductsRoute = Ember.Route.extend()
Weave.ProductsSelectProductRoute = Ember.Route.extend
  model: ->
    Weave.Product.find()
  events:
    startCampaignForProduct: (product)->
      @transitionTo 'referralBatches.new', Weave.Campaign.find product.get('campaign_ids.0')

Weave.CampaignRoute = Ember.Route.extend()

