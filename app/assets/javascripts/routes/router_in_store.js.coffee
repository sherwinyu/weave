Weave.ReferralBatchesRoute = Ember.Route.extend()
Weave.ReferralBatchesLookupRoute = Ember.Route.extend
  setupController: (controller, model) ->
    @campaign = @modelFor('campaign')
    @product = @modelFor('product')
    params =
      landing_email: Weave.rails.vars.landing_email,
      campaign_id: @campaign.get('id')
      referral_batch:
        meta:
          action: "lookup_by_email"
    referralBatches = Weave.ReferralBatch.find params
    #TODO(syu): TEST ME
    referralBatches.then(
      ((rBs) =>
        rB = rBs.get('firstObject')
        rB.set('product', @product)
        @transitionTo 'referralBatch.show', rB
      ),
      (error) -> console.log('Error occured', error)
      )

Weave.ReferralBatchesNewRoute = Ember.Route.extend
  #TODO(syu): TEST ME
  setupController: (controller, model) ->
    @campaign = @modelFor('campaign')
    @product = @modelFor('product')
    @referralBatch = Weave.ReferralBatch.createRecord(campaign: @campaign, product: @product)
    @referralBatch.save().then(
      ((result) =>
        @transitionTo('referralBatch.show', result)
      ),
      (error) -> console.log('Error occured', error)
      )

Weave.ReferralBatchRoute = Ember.Route.extend
  activate: ->
    utils.track "route activate",
      route: "referral batch"

  model: (params)->
    Weave.ReferralBatch.find params.story_id
  events:
    facebookAuthenticated: ->
      # @modelFor('referralBatch').set 'sender', @controllerFor('authentication').get 'user'

    # attemptAuthAndRefer event
    # triggers authenticationController.facebookLogin
    #   which returns a promise
    # if the promise is successful, send 'startReferring'
    # else
    #   give an error notification
    # Context:
    #   sent by referral
    attemptAuthAndRefer: ->
      p = @controllerFor('authentication').facebookLogin()
      p.then(
        (success) => @send 'startReferring',
        (failure) => @controllerFor('application').pushNotification ("Sorry, something went wrong. Try logging in via Facebook again.")
      )
    attemptAuthNoFacebook: (name, email) ->
      user = @controllerFor('authentication').createAndAuthenticateUser(name, email)
      user.one 'becameError', =>
        @controllerFor('application').pushNotification ("Sorry, there was an error. Try again.")
      user.one 'becameInvalid', =>
        @controllerFor('application').pushNotification ("Sorry, there was an error. Try again.")
        #user.one 'didLoad', =>
      user.one 'didCreate', =>
        Ember.run.next =>
          @modelFor('referralBatch').set 'sender', @controllerFor('authentication').get 'user'
        @send 'startReferring'

    updateEmail: (email)->
      # TODO (syu) validate me!!!!
      ###

      user_id = @controllerFor('authentication').get('user.id')
      email = @controllerFor('authentication').get('user.canonical_email')
      sender = @controllerFor('authentication').get('user')

      # TODO (syu): convert this to correctly
      p = utils.post
        url: "/users/#{user_id}"
        data:
          user_email: email

          # user.
      ###
      p = @controllerFor('authentication').get('user').save()
      p.then(
        (success) => @controllerFor('application').pushSuccessNotification "Email confirmed!",
        (error) => @controllerFor('application').pushNotification "Invalid email."
      )


    startReferring: ->
      @controllerFor('referral').set 'firstReferralSent', false
      @transitionTo 'referral.select_recipient',

    startNewReferral: ->
      @controllerFor('referral').set 'firstReferralSent', true
      @transitionTo 'referral.select_recipient' #, {referral: {}

    finishReferralBatch: ->
      @controllerFor('authentication').logout()
      @transitionTo 'products.selectProduct'

  renderTemplate: ->
    @_super()

Weave.ReferralBatchShowRoute = Ember.Route.extend
  model: ->
    @modelFor('referralBatch')

Weave.ReferralRoute = Ember.Route.extend
  events:
    selectRecipient: ->
      @transitionTo 'referral.select_recipient' #, {referral: {}
    editBody: (referral)->
      @transitionTo 'referral.edit_body', referral
  renderTemplate: ->
    @_super()

Weave.ReferralSelectRecipientRoute = Ember.Route.extend
  activate: ->
    utils.track "route activate",
      route: "referral select recipient"
  redirect: (model) ->
    unless @controllerFor('authentication').get('authenticated')
      @controllerFor('application').pushNotification ("Sorry, you need to login via Facebook to refer friends")
      @transitionTo "referralBatch.show", @modelFor('referralBatch')

  _createReferral: ->
    sender = @controllerFor('authentication').get('user')
    model = Weave.Referral.createRecord
      referralBatch: @modelFor('referralBatch')
      sender: sender
      sender_email: sender?.get('email')

  model: (params)->
    return # do nothing
    @_createReferral()

  setupController: (controller, model) ->
    model = @_createReferral()
    @controllerFor('referral').set('content', model)

  renderTemplate: ->
    if @controllerFor('referral').get('firstReferralSent')
      @render 'referralBatchDone',
        outlet: 'addendum'

        into: 'referralBatch'
        controller: 'referralBatch'

    @render 'referralSelectRecipient',
      into: 'referral'
      outlet: 'referralSelectRecipient'
      controller: 'referral'

  activate: ->
    # @controllerFor('referral').set('selectingRecipient', true)
  deactivate: ->
    # @controllerFor('referral').set('selectingRecipient', false)

  events:
    recipientSelected: ->
      @controllerFor('referral').get('content').one 'didCreate', =>
        # @modelFor('referral.select_recipient').one 'didCreate', =>
        Ember.run.next @, =>
          referral = @controllerFor('referral').get 'content'
          @send 'editBody', referral
      @controllerFor('referral').createWithRecipient()

Weave.ReferralEditBodyRoute = Ember.Route.extend
  activate: ->
    utils.track "route activate",
      route: "referral edit body"
  redirect: (model) ->
    @transitionTo 'referral.select_recipient' unless model?.get('id')

  setupController: (controller, model) ->
    @controllerFor('referral').set('content', model)
    @controllerFor('referral').set 'message', @controllerFor('referral').get('copy').get("referralMessage")
    # "I just shopped at New Living, a mission-driven Certified Benefit Corporation that has made a commitment to measure success on a social, environmental and economic level. I know you care a lot about where you shop, so I thought I'd let you know about New Living."
    @controllerFor('referral').set('editingBody', true)
  renderTemplate: ->

    @render 'referralSelectRecipient',
      into: 'referral'
      outlet: 'referralSelectRecipient'
      controller: 'referral'

    @render 'referralEditBody',
      into: 'referral'
      outlet: 'referralEditBody'
      controller: 'referral'

  deactivate: ->
    @controllerFor('referral').set('editingBody', false)

  events:
    deliverClicked: (referral) ->
      @controllerFor('referral').get('content').one 'didUpdate', =>
        @send 'startNewReferral'
      @controllerFor('referral').updateAndDeliver()
