Weave.User = DS.Model.extend
  name: DS.attr 'string'
  email: DS.attr 'string'
  canonical_email: DS.attr 'string'
  canonical_name: DS.attr 'string'
  email_provided: DS.attr 'boolean'

  meta: DS.attr 'json', defaultValue: {}
