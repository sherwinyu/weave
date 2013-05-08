Weave.FriendFilter = Ember.Object.extend
  friendResultToFriendStruct: (friendResult, provider) ->
    if provider == "FACEBOOK"
      {
        label: friendResult.name
        meta:
          name: friendResult.name
          uid: friendResult.id
          provider: "FACEBOOK"
          info: friendResult
      }

  friendSource: ->
    @_friends ||= facebook.query("/me/friends").then (friendResults) =>
      friendResults.data.map (friendResult) =>
        @friendResultToFriendStruct(friendResult, "FACEBOOK")

  # TODO(syu): Refactor this bad boy
  filterAndRank: (pfriends, score) ->
    pfriends.then (friends) =>
      friends.forEach (friend) =>
        friend.meta.score = score.call(@, friend)
      friends.sort (a, b) ->
         b.meta.score - a.meta.score
      friends = friends.filter (friend) -> friend.meta.score > 0
      friends

  filterAndRankAgainst: (term)->
    @filterAndRank( @friendSource(), @scoreAgainstTerm(term))

  #scoringFunction ::
  # term -- string -- the search term
  # friendStruct -- a friendStruct
  # returns -- integer -- rank
  score: (term, friendStruct) ->
    terms = term.trim().split(/\s+/)
    regexs = (new RegExp "\\b#{term}", "i" for term in terms)
    filtered = regexs.filter (regex)-> regex.test friendStruct.meta.name
    filtered.length

  scoreAgainstTerm: (term) ->
    (friendStruct) -> @score(term, friendStruct)
