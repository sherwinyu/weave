Weave.Customization = DS.Model.extend
  content: DS.attr 'string'
  campaigns: DS.hasMany 'Weave.Campaign'
  product: DS.belongsTo 'Weave.Product'
