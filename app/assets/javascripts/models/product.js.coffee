Weave.Product = DS.Model.extend
  name: DS.attr 'string'
  description: DS.attr 'string'
  campaign_ids: DS.attr 'json'
  customizations: DS.hasMany 'Weave.Customization'
