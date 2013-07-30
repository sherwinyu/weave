Weave.Campaign = DS.Model.extend
  description: DS.attr "string"
  outreachEmailContent: DS.attr 'string'
  senderPageContent: DS.attr 'string'
  recipientPageContent: DS.attr 'string'
  live: DS.attr 'boolean'
  client: DS.attr 'json'
  _products: null

  # HACKY
  # When the client to this model changes, we want to check if product_ids is available.
  # If it is, and the ProductSelectproduct controller does not have its content set,
  # we do a Product.find and set its content.
  #
  # Context:
  # When arriving at ProductsSelectProduct route through transitionTo, Weave.Campaign.find
  # has not finished materializing, so campaign.client.product_ids is still undefined.
  # So instead of setting content in the setupController hook, we do it here.
  clientChanged: (->
    product_ids = @get('client.product_ids')
    console.log "client.product_ids", product_ids
    if product_ids && !ctrl('productSelectProduct')?.get('content')
      _products = Weave.Product.find ids: product_ids
      Ember.run.next ->
        ctrl('productsSelectProduct').set 'content', _products
  ).observes('client')
