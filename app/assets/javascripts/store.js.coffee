DS.RESTAdapter.configure 'Weave.Customization',
  sideloadsAs: 'customizations'

DS.RESTAdapter.configure 'plurals',
  referral_batch: "referral_batches"
  referralBatch: "referralBatches"

DS.RESTAdapter.map 'Weave.Referral',
  customizations:
    embedded: 'always'

DS.RESTAdapter.registerTransform 'json',
  serialize: (json) ->
    json
  deserialize: (json) ->
    json # Em.assert 'this should never happen', false

Weave.Store = DS.Store.extend
  revision: 12
  adapter: DS.RESTAdapter.create()
