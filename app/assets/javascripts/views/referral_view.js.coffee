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
        select: (event, ui) ->
          # Fill in the input fields
          $("#name-or-email").val ui.item.label
          $("#fb-uid").val ui.item.value.id
          $("#fb-uinfo").val JSON.stringify(ui.item.value.info)
          console.log ui.item.zug
          # Prevent the value from being inserted in "#name"
          false
        minLength: 2
        source: (request, response) =>
          @get('friendFilter').filterAndRankAgainst(request.term).then (friends) ->
            response(friends)


          ###
          @nameAutoComplete().then (results) =>
            filtered = results.filter (e) => @nameFilter(request.term, e.label)
            filtered.map (e) ->
              facebook.query("#{e.value.id}?fields=location,education,political").done( (results) ->
                e.value["info"] = results
              )
          response(filtered)
              ###

Weave.ReferralEditBodyView = Ember.View.extend
  classNames: ['edit-body']
  templateName: "referral_edit_body"

Weave.ReferralCustomizationsSelectView = Ember.View.extend
  classNames: ['referral-customizations']
  templateName: "referral_customizations_select"

