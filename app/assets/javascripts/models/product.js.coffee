Weave.Product = DS.Model.extend
  description: DS.attr 'string'
  description: DS.attr 'string'
  campaigns: DS.hasMany 'Weave.Campaign'
  customizations: DS.hasMany 'Weave.Customization'



