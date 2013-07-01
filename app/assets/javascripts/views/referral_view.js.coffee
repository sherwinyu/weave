Weave.ReferralBatchShowView = Ember.View.extend
  classNames: ['referral-batch-show']
  templateName: "referral_batch_show"

Weave.ReferralView = Ember.View.extend
  classNames: ['referral']
  didInsertElement: ->
    @set('context.myView', @)
  willDestroyElement: ->
    @set 'context.myView', null

Weave.ReferralConfirmSenderView = Ember.View.extend
  classNames: ['confirm-sender']
  templateName: "referral_confirm_sender"
