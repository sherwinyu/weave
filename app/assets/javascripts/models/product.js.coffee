Weave.Product = DS.Model.extend
  name: DS.attr 'string'
  description: DS.attr 'string'
  customizations: DS.hasMany 'Weave.Customization'

