Weave.ReferralBatchShowView = Ember.View.extend
  classNames: ['referral-batch-show']
  templateName: "referral_batch_show"
  _invalidEmail: null
  _senderEmail: null
  _senderName: null
  waga: 'woola'
  shareClicked: (senderName, senderEmail) ->
    if /@/.test senderEmail
      @get('controller').send "attemptAuthNoFacebook", senderName, senderEmail
    else
      @set '_invalidEmail', true
