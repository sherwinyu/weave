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
  recipient_attributes: DS.attr 'json'
  recipient: DS.attr 'json'
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
