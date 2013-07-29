Weave.Campaign = DS.Model.extend
  description: DS.attr "string"
  outreachEmailContent: DS.attr 'string'
  senderPageContent: DS.attr 'string'
  recipientPageContent: DS.attr 'string'
  live: DS.attr 'boolean'
  client: DS.attr 'json'
  _products: null

  clientChanged: (->
    product_ids = @get('client.product_ids')
    console.log "client.product_ids", product_ids
    if product_ids && !@get('_products')
      _products = Weave.Product.find ids: product_ids
      Ember.run.next ->
        ctrl('productsSelectProduct').set 'content', _products
  ).observes('client')
