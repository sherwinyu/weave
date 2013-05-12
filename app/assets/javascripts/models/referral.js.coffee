Weave.Referral = DS.Model.extend
  message: DS.attr 'string'
  customizations: DS.hasMany 'Weave.Customization'
  referralBatch: DS.belongsTo 'Weave.ReferralBatch'
  recipient_attributes: DS.attr 'json'


  setAvailableCustomizations: (->
    @set 'availableCustomizations',
      @get('referralBatch.campaign.product.customizations')
        .map (customization) ->
          selected: false
          id: customization.get 'id'
          description: customization.get 'description'
          source: customization
  )
  init: ->
    @_super()
    Ember.run.next @, ->
      @setAvailableCustomizations()

  customizationSelected: (->
    console.log 'customization selected'
  ).observes('availableCustomizations.@each.selected')
