DS.RESTAdapter.configure 'Weave.Customization',
  sideloadsAs: 'customizations'

DS.RESTAdapter.configure 'plurals',
  referral_batch: "referral_batches"
  referralBatch: "referralBatches"

Weave.Store = DS.Store.extend
  revision: 12
  adapter: DS.RESTAdapter.create()
