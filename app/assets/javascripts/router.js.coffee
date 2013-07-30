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
  model: (params)->
    console.log params
  setupController: (controller, model) ->
    debugger

Weave.IndexRoute = Ember.Route.extend
  redirect: ->
    @transitionTo "products.selectProduct", Weave.Campaign.find Weave.rails.vars.campaign_id

Weave.OtherIndex = Ember.Route.extend
  redirect: ->
    @transitionTo "products.selectProduct"

Weave.ProductsRoute = Ember.Route.extend()
Weave.ProductsSelectProductRoute = Ember.Route.extend
  setupController: (controller, model)->
    # HACKY.
    # Only do a find for products and set the controller's content if campaign has resolved:
    #
    # Context:
    # When arriving at this route through transitionTo, Weave.Campaign.find has not
    # finished materializing, so campaign.client.product_ids is still undefined.
    # Instead, to fetch the products, we use an clientChanged observer defined on
    # the Campaign model.
    if (product_ids = @modelFor("campaign").get('client.product_ids'))
      products = Weave.Product.find ids: product_ids
      controller.set 'content', products

  events:
    startCampaignForProduct: (product)->
      if Weave.rails.isOnlineCampaign()
        ## TODO(syu): figure out actual implementation here
        @transitionTo 'referralBatches.lookup', product #, @modelFor("campaign") # Weave.Campaign.find Weave.rails.vars.campaign_id
      else
        @transitionTo 'referralBatches.new', product #, @modelFor("campaign") # Weave.Campaign.find 1

Weave.CampaignRoute = Ember.Route.extend()

