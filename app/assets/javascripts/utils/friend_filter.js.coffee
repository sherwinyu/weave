Weave.FriendFilter = Ember.Object.extend
  friendResultToFriendStruct: (friendResult, provider) ->
    Em.assert "provider is facebook", provider == "FACEBOOK"
    {
      label: friendResult.name
      pictureUrl: friendResult.picture.url
      user:
        name: friendResult.name
        email: friendResult.email
        info:
          uid: friendResult.id
          name: friendResult.name
          email: friendResult.email
          provider: "FACEBOOK"
          other_info: friendResult

    }

  facebookFriends: ->
    @_friends ||= facebook.query("/me/friends?fields=name,picture,location").then (friendResults) =>
      @_cached_friends = friendResults
      friendResults.data.map (friendResult) =>
        @friendResultToFriendStruct(friendResult, "FACEBOOK")

  # always returns a promise of friends
  friendSource: ->
    if @get('auth.omniauthed')
      @facebookFriends()
    else
      d = new $.Deferred()
      d.resolve []
      d.promise()

  # TODO(syu): Refactor this bad boy
  filterAndRank: (pfriends, score) ->
    pfriends.then (friends) =>
      friends.forEach (friend) =>
        friend.score = score.call(@, friend)
      friends.sort (a, b) ->
         b.score - a.score
      friends = friends.filter (friend) -> friend.score > 0
      friends.slice(0, 6)

  clearCache: ->
    @_friends = null

  filterAndRankAgainst: (term)->
    @filterAndRank( @friendSource(), @scoreAgainstTerm(term))

  #scoringFunction ::
  # term -- string -- the search term
  # friendStruct -- a friendStruct
  # returns -- integer -- rank
  score: (term, friendStruct) ->
    terms = term.trim().split(/\s+/)
    regexs = (new RegExp "\\b#{term}", "i" for term in terms)
    filtered = regexs.filter (regex)-> regex.test friendStruct.user.name
    filtered.length

  scoreAgainstTerm: (term) ->
    (friendStruct) -> @score(term, friendStruct)
