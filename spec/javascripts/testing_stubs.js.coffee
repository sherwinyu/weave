#= require sinon
# Only create stubs if we're NOT in unit testing mode (aka, we're doing feature specs)
unless jasmine?
  console.log "TESTING STUBS WALAWALA"
  @stubs =
    facebook: ->
      fbFriendResult1 =
        id: "4549"
        name: "Yan Zhang"
      fbFriendResult2 =
        id: "15796"
        name: "Seth Bannon"
      fbFriendResult3 =
        id: "555"
        name: "Jeff Chen"
      fbFriendResult4 =
        id: "666"
        name: "Jeff Zhang"
      dfd = new $.Deferred()
      dfd.resolve
        data: [ fbFriendResult1, fbFriendResult2, fbFriendResult3, fbFriendResult4 ]
        paging:
          next: "http://someurl.com/somemethod/someparams?123"
      @facebookQuery ||= facebookQuery = sinon.stub(facebook, "query")
      facebookQuery.withArgs("/me/friends").returns dfd.promise()
      @facebookQuery
  @stubs.facebook()
