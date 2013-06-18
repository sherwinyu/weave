Weave.Model = DS.Model.extend
  becameError: (args) ->
    app = ctrl('application')
    app.pushNotification "There was an error! #{args}"
    console.log "Unknown error #{args}"

  becameInvalid: (args) ->
    app = ctrl('application')
    app.pushNotification "There was an error! #{args}"
    console.log "Unknown error #{args}"

