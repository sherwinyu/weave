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
        @get('context').set('recipient', ui.item.meta)
        # Fill in the input fields
        @$("#name-or-email").val ui.item.label
        false
        @get('controller').createWithRecipient()
      minLength: 2
      source: (request, response) =>
        @get('friendFilter').filterAndRankAgainst(request.term).then (friends) ->
          response(friends)

Weave.ReferralEditBodyView = Ember.View.extend
# context: referral
  classNames: ['edit-body']
  templateName: "referral_edit_body"

Weave.ReferralCustomizationsSelectView = Ember.View.extend
  customizations: null
  classNames: ['referral-customizations']
  templateName: "referral_customizations_select"
