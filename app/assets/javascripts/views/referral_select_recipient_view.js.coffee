# Binds against referral controller
Weave.ReferralSelectRecipientView = Ember.View.extend
  # dependencies: 'referalView'
  _rankedFriends: null
  query: ""

  displayingFriends: false

  displayingNewFriendSuggestion: (->
    @get('query')?.length > 0
  ).property 'query'

  facebook: (->
    ctrl('authentication').get('auths.facebook')
  ).property()

  displayedFriends: (->
    @get('_rankedFriends')
  ).property '_rankedFriends', '_rankedFriends.@each'

  focusOut: (e) ->
  focusIn: (e) ->

  newFriendClicked: (friendName) ->
    recipient = Weave.User.createRecord
      name: friendName
    recipient.set('meta.role', 'recipient-new')
    @get('context').set('recipient', recipient)
    @get('controller').send 'recipientSelected'
    @set('displayingFriends', false)

  friendClicked: (friend)->
    recipient = Weave.User.createRecord friend.user
    recipient.set('meta.role', 'recipient')
    @get('context').set('recipient', recipient)
    @set('displayingFriends', false)

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
    @set('_rankedFriends', [])
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
          @set('displayingFriends', true)
          @updateDisplayedFriends(friends)

  # updateDisplayedFriends
  # Context: called by autocomplete#source with the result of
  # `friendFilter.rankAgainstTerm`.
  # param friends: a list of friendStructs
  # Behavior
  #   1) it sets the view's _rankedFriends to a copy of the friends
  #   2) it notifiesPropertyChange of _rankedFriends
  updateDisplayedFriends: (friends) ->
    @set('_rankedFriends', friends.copy())
    @notifyPropertyChange('_rankedFriends')


