Weave.ReferralBatch = DS.Model.extend
  url_code: DS.attr 'string'
  senderPageVisited_at: DS.attr 'date'
  senderPagePersonalized: DS.attr 'boolean'
  campaign: DS.belongsTo 'Weave.Campaign'
