Weave.Referral = DS.Model.extend
  message: DS.attr 'string'
  customizations: DS.hasMany 'Weave.Customization'
  referralBatch: DS.belongsTo 'Weave.ReferralBatch'
  recipient_attributes: DS.attr 'json'
