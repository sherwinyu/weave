Weave.Router.map (match)->
  @resource "campaign", path :"/campaign/:campaign_id", ->
    @resource "products", path: "/products", ->
      @route "selectProduct"

  @resource "product", path: "/products/:product_id", ->
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

Weave.ApplicationRoute = Ember.Route.extend
  renderTemplate: ->
    @render()
    @render 'auth_status',
      controller: 'authentication'
      outlet: "auth_status"
      into: "application"

Weave.CampaignRoute = Ember.Route.extend
  model: ->

Weave.IndexRoute = Ember.Route.extend
  redirect: ->
    @transitionTo "products.selectProduct", Weave.Campaign.find Weave.rails.vars.campaign_id

Weave.OtherIndex = Ember.Route.extend
  redirect: ->
    @transitionTo "products.selectProduct"

Weave.ProductsRoute = Ember.Route.extend()
Weave.ProductsSelectProductRoute = Ember.Route.extend
  model: ->
    window.product_ids = @modelFor("campaign").get("client.product_ids")
    console.log "client.product_ids", window.product_ids
    Weave.Product.find ids: product_ids
    ###
    ans = @modelFor("campaign").then (campaign) ->
      window.product_ids2 = campaign.get("client.product_ids")
      Weave.Product.find ids: product_ids2
    ###
    #ans
  events:
    startCampaignForProduct: (product)->
      if Weave.rails.isOnlineCampaign()
        ## TODO(syu): figure out actual implementation here
        @transitionTo 'referralBatches.lookup', product #, @modelFor("campaign") # Weave.Campaign.find Weave.rails.vars.campaign_id
      else
        @transitionTo 'referralBatches.new', product #, @modelFor("campaign") # Weave.Campaign.find 1

Weave.CampaignRoute = Ember.Route.extend()

