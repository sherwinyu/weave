Weave.Product = DS.Model.extend
  name: DS.attr 'string'
  description: DS.attr 'string'
  campaigns: DS.hasMany 'Weave.Campaign'
  customizations: DS.hasMany 'Weave.Customization'
