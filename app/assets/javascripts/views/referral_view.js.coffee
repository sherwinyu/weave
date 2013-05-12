Weave.ReferralBatchShowView = Ember.View.extend
  classNames: ['referral-batch-show']
  templateName: "referral_batch_show"

Weave.ReferralView = Ember.View.extend
  classNames: ['referral']
  didInsertElement: ->
    @set('context.myView', @)


Weave.ReferralSelectRecipientView = Ember.View.extend
  classNames: ['select-recipient']
  templateName: "referral_select_recipient"
  friendFilter: Weave.FriendFilter.create()
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
        console.log "WALAWALAWALA"
        @get('friendFilter').filterAndRankAgainst(request.term).then (friends) ->
          response(friends)
  selectingRecipientDidChange: ( ->
    unless @get('context.selectingRecipient')
      @$('input')?.autocomplete('zug')
  ).observes('context.selectingRecipient')

Weave.ReferralEditBodyView = Ember.View.extend
# context: referral
  classNames: ['edit-body']
  templateName: "referral_edit_body"

Weave.ReferralCustomizationsSelectView = Ember.View.extend
  customizations: null
  classNames: ['referral-customizations']
  templateName: "referral_customizations_select"
