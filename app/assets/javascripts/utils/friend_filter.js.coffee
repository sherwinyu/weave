Weave.FriendFilter = Ember.Object.extend
  # friendStructFromPayload -- converts the payload from a server response to FriendStruct object
  # param friendResult: a json object payload for a single friend from the `provider`
  # param provider: a string, right now only "FACEBOOK" is supported
  # Behavior
  #   1) the ret value contains
  #     * label
  #     * pictureUrl
  #     * location
  #     * user
  #       * name
  #       * email
  #       * info
  #         * uid
  #         * name
  #         * email
  #         * provider
  #         * other_info
  friendStructFromPayload: (friendPayload, provider) ->
    Em.assert "provider is facebook", provider == "FACEBOOK"
    friendStruct =
      label: friendPayload.name
      pictureUrl: friendPayload.picture.data.url
      location: friendPayload.location?.name
      user:
        name: friendPayload.name
        email: friendPayload.email
        info:
          uid: friendPayload.id
          name: friendPayload.name
          email: friendPayload.email
          provider: "FACEBOOK"
          other_info: friendPayload
    friendStruct

  # facebookFriends -- the generic query method for facebook
  # Behavior:
  #   1) it calls facebook.query with the desired fields (STUB this)
  #   2) it takes the facebook.query promise, unwraps the data, and, maps
  #     maps it through `friendStructFromPayload`, passing the friendPayload and FACEBOOK as the provider
  #   3) it returns a promise of a list of friendStructs
  # Returns:
  #   a promise of a list of friendStructs
  # @TODO(syu): refactor this into a more general approach regardless of provider type:
  # basically all that changes between providers is the query and the procesing
  facebookFriends: ->
    @_friends ||= facebook.query("/me/friends?fields=name,picture,location").then (friendPayloads) =>
      friendPayloads.data.map (friendPayload) =>
        @friendStructFromPayload(friendPayload, "FACEBOOK")

  googleFriends: ->

  # friendSource -- aggregated source of friend data for the friendFilter
  # Behavior:
  #   1) if we're logged in, return @facebookFriends
  #   2) if not, return a promsie for an empty list
  # Returns:
  #   a promise of a list of friends
  friendSource: ->
    if @get('auth.omniauthed')
      @facebookFriends()
    else
      d = new $.Deferred()
      d.resolve []
      d.promise()

  # filterAndRank -- takes a list of friends and a scoring function, and ranks them
  # param pfriends: a promise of a list of friendStructs
  # param score: a function(::friendStruct -> integer) that scores a friendResult against a search term
  # Context:
  #   Called behind the scenes by FriendFilter's public filterAndRankAgainst(term),
  #   which basically wraps the term and then calls this method.
  # Behavior:
  #   1) it resolves pFriends with
  #   2) it ranks friends based on the scoring function
  #   3) it only returns friends that have positive score
  #   4) it returns the top 6 matches
  # Returns:
  #   a promise of a list of friends, ranked by the scoring function
  #
  # TODO(syu): Refactor this bad boy
  _filterAndRank: (pfriends, score) ->
    pfriends.then (friends) =>
      friends.forEach (friend) =>
        friend.score = score.call(@, friend)
      friends.sort (a, b) ->
         b.score - a.score
      friends = friends.filter (friend) -> friend.score > 0
      friends.slice(0, 6)

  clearCache: ->
    @_friends = null

  # filterAndRankAgainst -- public entry point for friendFilter
  # Behavior:
  #   1) it calls _filterAndRank with the friendSource and the curried scoring function
  # Context:
  #   Currently, is called by RecipientSelectRecipientView in the `source` autocomplete function.
  #   it wraps all the processing for friendFiltering and simply returns a promise of 6 ranked friends to be displayed
  # param term: a string indicating what to search against
  # Returns:
  #   a promise of a list of ranked friend structs
  filterAndRankAgainst: (term)->
    @_filterAndRank( @friendSource(), @_scoreAgainstTerm(term))

  # _score: scores a friendStruct against a search term.
  # param term: a string representing the search term
  # param friendStruct: a friendStruct to be scored
  #
  # _score matches the friendStruct's name against the term by regex.
  #
  # Behavior:
  #   1 if
  # term -- string -- the search term
  # friendStruct -- a friendStruct
  # returns -- integer -- rank
  _score: (term, friendStruct) ->
    terms = term.trim().split(/\s+/)
    # regexs is an array of regular expressions matching for the beginning of
    regexs = (new RegExp "\\b#{term}", "i" for term in terms)
    # check to see how many of the regexs match
    filtered = regexs.filter (regex)-> regex.test friendStruct.user.name
    # return that as the score
    filtered.length

  # scoreAgainstTerm - curries the _score function to a term
  # params term: a string representing the search term
  # Behavior: returns a function that calls _score behind the scens
  # Returns:
  #   a 'score against term' function :: friendStruct -> integer rank
  _scoreAgainstTerm: (term) ->
    (friendStruct) -> @_score(term, friendStruct)
