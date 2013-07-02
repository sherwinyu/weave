Weave.ReferralBatchesRoute = Ember.Route.extend()
Weave.ReferralBatchesLookupRoute = Ember.Route.extend
  setupController: (controller, model) ->
    @campaign = @modelFor('campaign')
    params =
      landing_email: Weave.rails.vars.landing_email,
      referral_batch:
        meta:
          action: "lookup_by_email"
    referralBatches = Weave.ReferralBatch.find params
    #TODO(syu): TEST ME
    referralBatches.then(
      ((rBs) =>
        @transitionTo 'referralBatch.show', rBs.get('firstObject')
      ),
      (error) -> console.log('Error occured', error)
      )

Weave.ReferralBatchesNewRoute = Ember.Route.extend
  #TODO(syu): TEST ME
  setupController: (controller, model) ->
    @campaign = @modelFor('campaign')
    @referralBatch = Weave.ReferralBatch.createRecord(campaign: @campaign)
    @referralBatch.save().then(
      ((result) =>
        @transitionTo('referralBatch.show', result)
      ),
      (error) -> console.log('Error occured', error)
      )

Weave.ReferralBatchRoute = Ember.Route.extend
  model: (params)->
    Weave.ReferralBatch.find params.story_id
  events:
    facebookAuthenticated: ->
      @modelFor('referralBatch').set 'sender', @controllerFor('authentication').get 'user'
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

    attemptAuthAndRefer: ->
      p = @controllerFor('authentication').facebookLogin()
      p.then(
        (success) => @send 'startReferring',
        (failure) => @controllerFor('application').pushNotification ("Sorry, you need to login via Facebook to refer friends")
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
  redirect: (model) ->
    unless @controllerFor('authentication').get('omniauthed')
      @controllerFor('application').pushNotification ("Sorry, you need to login via Facebook to refer friends")
      @transitionTo "referralBatch.show", @modelFor('referralBatch')

  model: (params)->
    sender = @controllerFor('authentication').get('user')
    console.log('sender email from facebook', sender.get 'email')
    console.log('sender email from rails params', Weave.rails.vars.landing_email)

    model = Weave.Referral.createRecord referralBatch: @modelFor('referralBatch'), sender: sender, sender_email: sender.get('email')

  setupController: (controller, model) ->
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
      @modelFor('referral.select_recipient').one 'didCreate', =>
        Ember.run.next @, =>
          rf = @controllerFor('referral').get 'content'
          # rf.get('stateManager').send('finishedMaterializing')
          @send 'editBody', rf
      @controllerFor('referral').createWithRecipient()

Weave.ReferralEditBodyRoute = Ember.Route.extend
  redirect: (model) ->
    @transitionTo 'referral.select_recipient' unless model?.get('id')

  setupController: (controller, model) ->
    @controllerFor('referral').set('content', model)
    @controllerFor('referral').set 'message', "I just shopped at New Living, a mission-driven Certified Benefit Corporation that has made a commitment to measure success on a social, environmental and economic level. I know you care a lot about where you shop, so I thought I'd let you know about New Living."
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
