Weave.ReferralView = Ember.View.extend
  didInsertElement: ->
    @set('context.myView', @)


Weave.ReferralSelectRecipientView = Ember.View.extend
  classNames: ['select-recipient']
  templateName: "referral_select_recipient"
  friends: null
  didInsertElement: ->
    @bindAutocompletion $('input')
  init: ->
    @_super()

  nameFilter: (term, name) ->
    terms = term.trim().split(/\s+/)
    regexs = (new RegExp "\\b#{term}", "i" for term in terms)
    regexs.every (regex) -> regex.test name

  nameAutoComplete: ->
    @friends ||= facebook.query("/me/friends").then( (results) ->
      results.data.map (item) ->
        {label: item.name, value: item}
    )

  bindAutocompletion: ($el) ->
      $el.autocomplete
        select: (event, ui) ->
          # Fill in the input fields
          $("#name-or-email").val ui.item.label
          $("#fb-uid").val ui.item.value.id
          $("#fb-uinfo").val JSON.stringify(ui.item.value.info)
          # Prevent the value from being inserted in "#name"
          false
        minLength: 2
        source: (request, response) =>
          @nameAutoComplete().then (results) =>
            filtered = results.filter (e) => @nameFilter(request.term, e.label)
            filtered.map (e) ->
              facebook.query("#{e.value.id}?fields=location,education,political").done( (results) ->
                e.value["info"] = results
              )
            response(filtered)
