# Binds against referral controller
Weave.ReferralSelectRecipientView = Ember.View.extend
  # dependencies: 'referalView'
  listedFriends: null
  displayedFriends: (->
    @get('listedFriends')
  ).property 'listedFriends', 'listedFriends.@each'

  friendClicked: (friend)->
    recipient = Weave.User.createRecord friend.user
    recipient.set('meta.role', 'recipient')
    @get('context').set('recipient', recipient)

    # Fill in the input fields
    @$("#name-or-email").val friend.user.name
    @get('controller').send 'recipientSelected'

  recipientEmailOrName: ((key, val)->
    @get('controller.recipient.name')
  ).property('controller.recipient')

  friendFilterBinding: "controller.friendFilter"

  classNames: ['select-recipient']

  templateName: "referral_select_recipient"

  didInsertElement: ->
    @initAutocompletion @$('input')
    if @get('controller.selectingRecipient')
      @$('#wala')?.val ''

  init: ->
    @set('listedFriends', [])
    @_super()

  initAutocompletion: ($el) ->
    $el.autocomplete
      select: (event, ui) =>
        Em.assert "jquery-autocomplete-select event should not happen because we are custom rolling a solution"

      focus: (event, ui) =>
        @$(".recipient-name-or-email").val ui.item.label
      minLength: 2

      source: (request, response) =>
        @get('friendFilter').filterAndRankAgainst(request.term).then (friends) =>
          @set('listedFriends', friends.copy())
          @notifyPropertyChange('listedFriends')


