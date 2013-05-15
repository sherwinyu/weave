Weave.ReferralBatchDoneView = Ember.View.extend
  logoutText: (->
    "Finish (and log out of Facebook)"
  ).property('context.firstReferralSent')
  classNames: ["referral-batch-done"]

Weave.ReferralBatchView = Ember.View.extend
  classNames: "referral-batch"
