DS.RESTAdapter.configure 'Weave.Customization',
  sideloadsAs: 'customizations'

Weave.Store = DS.Store.extend
  revision: 12
  adapter: DS.RESTAdapter.create()


    # DS.RESTAdapter.configure 'Weave.Visit',
    # sideloadsAs: 'visits'

