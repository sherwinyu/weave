Weave.ApplicationView = Ember.View.extend
  classNames: ['weave']

Weave.ApplicationController = Ember.Object.extend
  notifications: null
  destroyNotification: (notif) ->
    @get('notifications').removeObject notif
  pushNotification: (message) ->
    @get('notifications').pushObject Ember.Object.create(message: message)
  pushNotification: (message) ->
    @get('notifications').pushObject Ember.Object.create(message: message, type: 'success')
  init: ->
    @_super()
    @set 'notifications', []
