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
    Ember.run =>
      @referral = Weave.Referral.createRecord
        content: "referral content"
        recipient_attributes: @recipient
        customizations: []
        referral_batch_id: 1

      @referralController = Weave.ReferralController.create content: @referral
  describe "ceateWithRecipient model", ->
    beforeEach ->
      @ajax = sinon.stub(jQuery, "ajax")
    it "ajaxes with the correct payload", ->
      Ember.run =>
        @referralController.createWithRecipient()
      payload = @ajax.getCall(0).args[0].data
      debugger

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

  describe "formatNew", ->
    it "works", ->
      formatted = @referralController.formatNew @content
      expect(formatted.referral_batch_id).toEqual 1
      expect(formatted.referral.recipient_attributes.name).toEqual "sherwin yu"
      expect(formatted.referral.recipient_attributes.email).toEqual "abc@beg.com"
      expect(formatted.referral.recipient_attributes.user_infos_attributes[0].provider).toEqual "FACEBOOK"
      expect(formatted.referral.recipient_attributes.user_infos_attributes[0].name).toEqual "sherwin yu"
      expect(formatted.referral.recipient_attributes.user_infos_attributes[0].uid).toEqual "sherwinxyu"
      expect(formatted.referral.recipient_attributes.user_infos_attributes[0].email).toEqual "abc@beg.com"
