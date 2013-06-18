Weave.Model = DS.Model.extend
  becameError: (args) ->
    @controllerFor('application').pushNotification "there was an error! #{errors}"
    console.log "Unknown error #{args}"

  becameInvalid: (args) ->
    @controllerFor('application').pushNotification "there was an error! #{errors}"
    console.log "Unknown error #{args}"

