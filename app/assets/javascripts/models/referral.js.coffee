Weave.ReferralCustomization = Ember.Object.extend
  selected: false
  customization: null
  referral: null
  customizationSetBinding: "referral.customizations"
  descriptionBinding: "customization.description"
  selectedToggled: ( ->
    if @get('selected')
      debugger
      @get('customizationSet').pushObject( @get 'customization' )
    else
      debugger
      if @get('customizationSet').contains( @get 'customization' )
        debugger
        @get('customizationSet').removeObject @get('customization')

  ).observes 'selected'

Weave.Referral = DS.Model.extend
  message: DS.attr 'string'
  customizations: DS.hasMany 'Weave.Customization'
  referralBatch: DS.belongsTo 'Weave.ReferralBatch'
  recipient_attributes: DS.attr 'json'

  availableCustomizations: (->
    @get('stateManager')
    @get('referralBatch.campaign.product.customizations')
      ?.map (customization) =>
        Weave.ReferralCustomization.create(customization: customization, referral: @)
    ).property('referralBatch')

