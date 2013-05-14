Weave.ReferralSelectRecipientView = Ember.View.extend
  # dependencies: 'referalView'
  friendFilterBinding: "context.friendFilter"
  classNames: ['select-recipient']
  templateName: "referral_select_recipient"
  didInsertElement: ->
    @bindAutocompletion @$('input')

  init: ->
    @_super()

  bindAutocompletion: ($el) ->
    $el.autocomplete
      select: (event, ui) =>
        @get('context').set('recipient_attributes', ui.item.user)

        # Fill in the input fields
        @$("#name-or-email").val ui.item.label
        @get('controller').send 'recipientSelected'
      minLength: 2
      source: (request, response) =>
        @get('friendFilter').filterAndRankAgainst(request.term).then (friends) ->
          response(friends)
  selectingRecipientDidChange: ( ->
    unless @get('context.selectingRecipient')
      @$('input')?.autocomplete('zug')
  ).observes('context.selectingRecipient')
