describe "ReferralController", ->
  beforeEach ->
    @recipient =
      name: "sherwin yu"
      email: "abc@beg.com"
      info:
        provider: "FACEBOOK"
        name: "sherwin yu"
        uid: "sherwinxyu"
        email: "abc@beg.com"
        other_info: "walawala!"
    Ember.testing = false
    Ember.run =>
      @referralBatch = Weave.ReferralBatch.find(1)
    Ember.run =>
      @referral = Weave.Referral.createRecord
        message: "referral content"
        recipient_attributes: @recipient
        customizations: []
        referralBatch: @referralBatch
      @referralController = Weave.ReferralController.create content: @referral, container: Weave.__container__
  describe "ceateWithRecipient model", ->
    beforeEach ->
      Ember.testing = false
      @ajax = sinon.stub(jQuery, "ajax")

    # the following spec is kind of integrationy-y, but needs to be here because ember data is rather unstable"
    it "ajaxes with the correct payload", ->
      Ember.run => @referralController.createWithRecipient()
      payload = @ajax.getCall(0).args[0].data
      referral_json =
        referral:
          message: "referral content"
          recipient_attributes:
            name: "sherwin yu"
            email: "abc@beg.com"
            user_infos_attributes: [
              {
              provider: "FACEBOOK"
              name: "sherwin yu"
              uid: "sherwinxyu"
              email: "abc@beg.com"
              other_info: "walawala!"
              }
            ]
          customizations: []
          referral_batch_id: 1
      expect(payload).toEqual JSON.stringify referral_json

    it "ajaxes with the correct url", ->
      Ember.run => @referralController.createWithRecipient()
      url = @ajax.getCall(0).args[0].url
      expect(url).toEqual "/referrals"

    afterEach ->
      @ajax.restore()
