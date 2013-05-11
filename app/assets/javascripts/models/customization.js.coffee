Weave.Customization = DS.Model.extend
  description: DS.attr 'string'
  campaigns: DS.hasMany 'Weave.Campaign'
  product: DS.belongsTo 'Weave.Product'
