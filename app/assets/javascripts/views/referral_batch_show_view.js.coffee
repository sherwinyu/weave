Weave.ReferralBatchShowView = Ember.View.extend
  classNames: ['referral-batch-show']
  templateName: "referral_batch_show"

  _senderEmail: null
  _senderName: null
  waga: 'woola'
  shareClicked: (senderName, senderEmail) ->
    5
