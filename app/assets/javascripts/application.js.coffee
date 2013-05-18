#= require jquery
#= require jquery_ujs
#= require handlebars
#= require ember
#= require bootstrap
#= require ember-data
#= require ember-bootstrap/all
#
#= require_self
#= require weave
#
#= require facebook
#= require referrals
#= require suggester
window.Weave = Ember.Application.create
  LOG_TRANSITIONS: true

DS.Model.reopenClass
  loadFromJson: (json) ->
    key = @toString().split('.')[1].toLowerCase()
    id = json[key].id
    store =  DS.get('defaultStore')
    adapter = store.adapterForType(@)
    adapter.didFindRecord( store, @, json, id)
    p = @find id
    p
