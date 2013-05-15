Weave.ReferralController = Ember.ObjectController.extend
  myView: null
  firstReferralSent: false
  editingBody: false
  selectingRecipient: false

  createWithRecipient: ->
    # TODO(syu): refactor out into its own format method?
    recip = @get('content').get('recipient_attributes')
    recip.user_infos_attributes = [recip.info]
    delete recip.info
    @get('content.transaction').commit()

    # @get('content').save()
    # .then (referral) -> @send 'editBody', referral
    # @send 'editBody', @get('content')
  updateAndDeliver: ->
    @get('store').commit()


  createWithRecipient2: ->
    referral_batch_id = 1 # @get('content').referral_batch_id
    params = @formatNew @get('content')
    # params.referral_batch_id = 1
    utils.post
      data: params
      url:  "/referrals"#referral_batches/#{referral_batch_id}/referrals"
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
      referral_batch_id: 1
    }
