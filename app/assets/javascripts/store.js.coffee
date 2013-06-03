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
    else @_super(type, name)

  extractValidationErrors: (type, json) ->
    json.errors = json[@rootForType(type)].errors
    @_super(type, json)
    ###
extractValidationErrors: function(type, json) {
    var errors = {};

    get(type, 'attributes').forEach(function(name) {
      var key = this._keyForAttributeName(type, name);
      if (json['errors'].hasOwnProperty(key)) {
        errors[name] = json['errors'][key];
      }
    }, this);

    return errors;
  }
});
  wagaWaga:
  ###

Weave.Store = DS.Store.extend
  revision: 12
  adapter: DS.RESTAdapter.create
    serializer: Weave.Serializer
