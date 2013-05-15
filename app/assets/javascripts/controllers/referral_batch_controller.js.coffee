Weave.ReferralBatchController = Ember.ObjectController.extend
  content: null
  needs: 'authentication'
  auth: null
  authBinding: 'controllers.authentication'
