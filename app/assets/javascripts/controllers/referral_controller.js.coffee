Weave.ReferralController = Ember.ObjectController.extend
  needs: ['referralBatch'] #, 'campaign', 'authentication']
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
    # TODO(syu): currently doing this to set the meta action -- should use its own transaction.
    ctrl('referralBatch').set('meta.action', 'update_add_sender')
    @get('content.transaction').commit()

  updateAndDeliver: ->
    @get('content.recipient').set('email', @get 'content.recipient_email')
    @get('content').set('meta.action', 'update_body_and_deliver')
    @get('content').one 'didUpdate', =>
      @get('controllers.referralBatch.referrals').pushObject @get('content')
    @get('content.transaction').commit()
    utils.track('deliver',
      from: @get 'content.sender_email'
      to: @get 'content.recipient_email'
      customizations: @get 'content.customizations.length'
    )


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
