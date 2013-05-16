# Binds against referral controller
Weave.ReferralSelectRecipientView = Ember.View.extend
  # dependencies: 'referalView'
  recipientEmailOrName: ((key, val)->
    @get('controller.recipient.name')
  ).property('controller.recipient')
  friendFilterBinding: null
  classNames: ['select-recipient']
  templateName: "referral_select_recipient"
  didInsertElement: ->
    @bindAutocompletion @$('input')
    @set 'friendFilter', @get('context.friendFilter')
    if @get('controller.selectingRecipient')
      @$('#wala')?.val ''

  init: ->
    @_super()

  bindAutocompletion: ($el) ->
    $el.autocomplete
      select: (event, ui) =>
        @get('context').set('recipient_attributes', ui.item.user)

        # Fill in the input fields
        @$("#name-or-email").val ui.item.label
        @get('controller').send 'recipientSelected'

      focus: (event, ui) =>
        @$(".recipient-name-or-email").val ui.item.label

        # appendTo: ".select-recipient"
      minLength: 2

      source: (request, response) =>
        @get('friendFilter').filterAndRankAgainst(request.term).then (friends) ->
          response(friends)

  selectingRecipientDidChange: ( ->
    unless @get('controller.selectingRecipient')
      @$('input')?.autocomplete('zug')
    @$('#wala')?.val ''
  ).observes('controller.selectingRecipient')

