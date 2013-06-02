Weave.ReferralCustomization = Ember.Object.extend
  selected: false
  customization: null
  referral: null
  customizationSetBinding: "referral.customizations"
  descriptionBinding: "customization.description"
  selectedToggled: ( ->
    if @get('selected')
      @get('customizationSet').pushObject( @get 'customization' )
    else
      if @get('customizationSet').contains( @get 'customization' )
        @get('customizationSet').removeObject @get('customization')

  ).observes 'selected'

Weave.Referral = DS.Model.extend
  message: DS.attr 'string'
  customizations: DS.hasMany 'Weave.Customization'
  referralBatch: DS.belongsTo 'Weave.ReferralBatch'
  recipient: DS.belongsTo 'Weave.User'
  sender: DS.belongsTo 'Weave.User'
  recipient_email: DS.attr 'string'
  sender_email: DS.attr 'string'

  meta: DS.attr 'json', defaultValue: {}

  recipientFirstName: (->
    [first, last] = @get('recipient.name')?.trim().split(/\s+/) || ["your friend"]
    first
  ).property('recipient')

  availableCustomizations: (->
    @get('stateManager')
    @get('referralBatch.campaign.product.customizations')
      ?.map (customization) =>
        Weave.ReferralCustomization.create(customization: customization, referral: @)
    ).property('referralBatch')

  becameError: (args) ->
    @controllerFor('application').pushNotification "there was an error! #{errors}"
    console.log "Unknown error #{args}"

  becameInvalid: (args) ->
    @controllerFor('application').pushNotification "there was an error! #{errors}"
    console.log "Unknown error #{args}"

  didCreate: ->
