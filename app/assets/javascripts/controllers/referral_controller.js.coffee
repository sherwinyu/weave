Weave.ReferralController = Ember.ObjectController.extend
  myView: null
  createWithRecipient: ->
    referral_batch_id = 1 # @get('content').referral_batch_id
    debugger
    utils.post
      data: @formatNew @get('content')
      url:  "referrals"#referral_batches/#{referral_batch_id}/referrals"
    @send 'editBody'

  formatUpdate:  ->
    # clone the referral object
    referral = $.extend(true, {}, @get('content'))
    referral_batch_id = referral.referral_batch_id
    delete referral.referral_batch_id
    {
      referral: referral
      referral_batch_id: referral_batch_id
    }
  formatNew: ->
    referral = $.extend(true, {}, @get('content'))
    referral_batch_id = referral.referral_batch_id
    recipient = referral.recipient
    recipient.user_infos_attributes = [referral.recipient.info]
    delete referral.referral_batch_id
    delete referral.recipient.meta
    {
      referral:
        content: null
        recipient_attributes: recipient
        #sender_id:
      referral_batch_id: referral_batch_id
    }
