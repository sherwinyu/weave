Weave.ProductsSelectProductView = Ember.View.extend
  friendFilterBinding: null
  classNames: ['select-product']
  templateName: "products_select_product"
  didInsertElement: ->
    @set 'friendFilter', @get('context.content')
  # templateName: "select_product"
Weave.ProductsView = Ember.View.extend
  classNames: ['products']
  templateName: "products"
