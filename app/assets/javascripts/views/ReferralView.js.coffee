Weave.ReferralView = Ember.View.extend
  classNames: ['referral']
  didInsertElement: ->
    @set('context.myView', @)


Weave.ReferralSelectRecipientView = Ember.View.extend
  classNames: ['select-recipient']
  templateName: "referral_select_recipient"
  friends: null
  didInsertElement: ->
    @bindAutocompletion @$('input')
  init: ->
    @_super()

  nameFilter: (term, name) ->
    terms = term.trim().split(/\s+/)
    regexs = (new RegExp "\\b#{term}", "i" for term in terms)
    regexs.every (regex) -> regex.test name

  nameAutoComplete: ->
    @friends ||= facebook.query("/me/friends").then( (results) ->
      results.data.map (item) ->
        {label: item.name, value: item, zug: "555"}
    )

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
          @nameAutoComplete().then (results) =>
            filtered = results.filter (e) => @nameFilter(request.term, e.label)
            filtered.map (e) ->
              facebook.query("#{e.value.id}?fields=location,education,political").done( (results) ->
                e.value["info"] = results
              )
            response(filtered)

Weave.ReferralEditBodyView = Ember.View.extend
  classNames: ['edit-body']
  templateName: "referral_edit_body"

Weave.ReferralCustomizationsSelectView = Ember.View.extend
  classNames: ['referral-customizations']
  templateName: "referral_customizations_select"

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

  filterAndRank: (pfriends, score) ->
    pfriends.then (friends) =>
      friends.forEach (friend) =>
        friend.meta.score = score.call(@, friend)
      friends.sort (a, b) ->
        a.meta.score - b.meta.score
      friends = friends.filter (friend) -> friend.meta.score > 0
      friends



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
