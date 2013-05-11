Weave.Referral = DS.Model.extend
  content: DS.attr 'string'
  customizations: DS.hasMany 'Weave.Customization'
  referralBatch: DS.belongsTo 'Weave.ReferralBatch'
