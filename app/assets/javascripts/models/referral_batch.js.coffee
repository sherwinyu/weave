Weave.ReferralBatch = Weave.Model.extend
  url_code: DS.attr 'string'
  senderPageVisited_at: DS.attr 'date'
  senderPagePersonalized: DS.attr 'boolean'
  campaign: DS.belongsTo 'Weave.Campaign'
  sender: DS.belongsTo 'Weave.User'
  # TODO(syu): HACKY
  referrals: null
  init: ->
    @_super()
    @set 'referrals', []
