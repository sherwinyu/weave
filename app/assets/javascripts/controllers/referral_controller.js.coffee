Weave.ReferralController = Ember.ObjectController.extend
  createWithRecipient: ->
    utils.post
      data: @formatNew @get('content')
      url:  "wala"
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
    recipient.user_infos_attributes = [referral.recipient.meta]
    delete referral.referral_batch_id
    {
      referral:
        content: null
        recipient_attributes: recipient
        #sender_id:
      referral_batch_id: referral_batch_id
    }
