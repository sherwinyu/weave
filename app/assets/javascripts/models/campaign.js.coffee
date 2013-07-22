Weave.Campaign = DS.Model.extend
  description: DS.attr "string"
  outreachEmailContent: DS.attr 'string'
  senderPageContent: DS.attr 'string'
  recipientPageContent: DS.attr 'string'
  live: DS.attr 'boolean'
  client: DS.attr 'json'
