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
    Ember.run =>
      @referralBatch = Weave.ReferralBatch.createRecord()
      @referralBatch.set 'id', 55
      @referral = Weave.Referral.createRecord
        content: "referral content"
        recipient_attributes: @recipient
        customizations: []
        referralBatch: @referralBatch

      @referralController = Weave.ReferralController.create content: @referral
  describe "ceateWithRecipient model", ->
    beforeEach ->
      @ajax = sinon.stub(jQuery, "ajax")

    # the following spec is kind of integrationy-y, but needs to be here because ember data is rather unstable"
    it "ajaxes with the correct payload", ->
      Ember.run => @referralController.createWithRecipient()
      payload = @ajax.getCall(0).args[0].data
      referral_json =
        referral:
          content: "referral content"
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
          referral_batch_id: 55
      expect(payload).toEqual JSON.stringify referral_json

    it "ajaxes with the correct url", ->
      Ember.run => @referralController.createWithRecipient()
      url = @ajax.getCall(0).args[0].url
      expect(url).toEqual "/referrals"

    afterEach ->
      @ajax.restore()

  xdescribe "createWithRecipient", ->
    beforeEach ->
      @post = sinon.stub(utils, "post")
    afterEach ->
      @post.restore()
    xit "posts to the correct url with correct data ", ->
      @referralController.createWithRecipient()
      expect(@post).toHaveBeenCalledOnce()
      expect(@post).toHaveBeenCalledWith
        data: @referralController.formatNew @referral
        url: "/referrals"
    describe "on success", ->
      it "sends event transitionTo editBody", ->
        @send = sinon.stub(@referralController, "send")
        @referralController.createWithRecipient()
        expect(@send).toHaveBeenCalled()

  xdescribe "formatNew", ->
    it "works", ->
      formatted = @referralController.formatNew @content
      expect(formatted.referral_batch_id).toEqual 1
      expect(formatted.referral.recipient_attributes.name).toEqual "sherwin yu"
      expect(formatted.referral.recipient_attributes.email).toEqual "abc@beg.com"
      expect(formatted.referral.recipient_attributes.user_infos_attributes[0].provider).toEqual "FACEBOOK"
      expect(formatted.referral.recipient_attributes.user_infos_attributes[0].name).toEqual "sherwin yu"
      expect(formatted.referral.recipient_attributes.user_infos_attributes[0].uid).toEqual "sherwinxyu"
      expect(formatted.referral.recipient_attributes.user_infos_attributes[0].email).toEqual "abc@beg.com"
