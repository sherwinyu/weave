DS.RESTAdapter.configure 'Weave.Customization',
  sideloadsAs: 'customizations'

DS.RESTAdapter.configure 'plurals',
  referral_batch: "referral_batches"
  referralBatch: "referralBatches"

DS.RESTAdapter.map 'Weave.Referral',
  customizations:
    embedded: 'always'
  recipient:
    embedded: 'always'

DS.RESTAdapter.map 'Weave.ReferralBatch',
  sender:
    embedded: 'always'

DS.RESTAdapter.registerTransform 'json',
  serialize: (json) ->
    json
  deserialize: (json) ->
    json # Em.assert 'this should never happen', false

Weave.Serializer = DS.RESTSerializer.extend
  keyForHasMany: (type, name) ->
    key = @keyForAttributeName type, name
    if (@embeddedType(type, name))
      return key
      #return key + "_attributes"
    else @_super()

Weave.Store = DS.Store.extend
  revision: 12
  adapter: DS.RESTAdapter.create()
  # serializer: Weave.Serializer
