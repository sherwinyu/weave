window.referrals =
  ###
  ajax:
    createReferral: (args) ->
      utils.ajax
        type: 'POST'
        data: args

    updateReferral: (args) ->
      utils.put
        data: args
  ###

  friends: null
  nameAutoComplete: ->
    @friends ||= facebook.query("/me/friends").then( (results) ->
      results.data.map (item) ->
        {label: item.name, value: item}
      # results.map (item) ->
        # {
    )

  nameFilter: (term, name) ->
    terms = term.trim().split(/\s+/)
    regexs = (new RegExp "\\b#{term}", "i" for term in terms)
    regexs.every (regex) -> regex.test name

  initBindings: ->

    # TODO(syu): mix in gmail
    $("#name-or-email").autocomplete
      select: (event, ui) ->
        # Fill in the input fields
        $("#name-or-email").val ui.item.label
        $("#fb-uid").val ui.item.value.id
        $("#fb-uinfo").val JSON.stringify(ui.item.value.info)
        # Prevent the value from being inserted in "#name"
        false
      minLength: 2
      source: (request, response) ->
        referrals.nameAutoComplete().then (results) ->
          filtered = results.filter (e) -> referrals.nameFilter(request.term, e.label)
          filtered.map (e) ->
            facebook.query("#{e.value.id}?fields=location,education,political").done( (results) ->
              e.value["info"] = results
            )
          response(filtered)

jQuery ->
  referrals.initBindings()
