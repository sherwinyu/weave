Weave.ReferralController = Ember.ObjectController.extend
  needs: 'referralBatch'
  myView: null
  firstReferralSent: false
  editingBody: false
  selectingRecipient: false

  createWithRecipient: ->
    # TODO(syu): refactor out into its own format method?
    # recip = @get('content').get('recipient_attributes')
    # recip.user_infos_attributes = [recip.info]
    # delete recip.info
    @get('content').set('meta.action', 'create_with_recipient')
    @get('content').save() # .transaction').commit()

    # @get('content').save()
    # .then (referral) -> @send 'editBody', referral
    # @send 'editBody', @get('content')
  updateAndDeliver: ->
    @get('content').one 'didUpdate', =>
      @get('controllers.referralBatch.referrals').pushObject @get('content')
    @get('store').commit()

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
      referral_batch_id: 1
    }
