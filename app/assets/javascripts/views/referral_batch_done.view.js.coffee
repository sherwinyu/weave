Weave.ReferralBatchDoneView = Ember.View.extend
  logoutText: (->
    "Finish (and log out of Facebook)"
  ).property('context.firstReferralSent')
  pluralizedReferrals: (->
    count = @get 'context.referrals.length'
    optS = ""
    optS = "s" if count > 1
    "#{count} referral#{optS}"
  ).property('context.referrals.length')
  classNames: ["referral-batch-done"]

Weave.ReferralBatchView = Ember.View.extend
  classNames: "referral-batch"
