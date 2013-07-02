#= require sinon
# Only create stubs if we're NOT in unit testing mode (aka, we're doing feature specs)
# TODO(syu): VCR // puffing billy??
unless jasmine?
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
    friendFilterGetAuth: ->
      friendFilter = lu("friendFilter:main")
      @getAuth = sinon.stub(friendFilter, 'get')
      @getAuth.withArgs('auth.omniauthed').returns true

  @stubs.facebook()
  @stubs.friendFilterGetAuth()
