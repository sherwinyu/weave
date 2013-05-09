describe "ReferralController", ->
  beforeEach ->
    @recipient =
      name: "sherwin yu"
      email: "abc@beg.com"
      meta:
        provider: "FACEBOOK"
        name: "sherwin yu"
        uid: "sherwinxyu"
        email: "abc@beg.com"
    @referral =
      content: "lala i'm a referral"
      content: "referral content"
      recipient: @recipient
      customizations: []
      referral_batch_id: 55



    @referralController = Weave.ReferralController.create content: @referral
  describe "createWithRecipient", ->
    beforeEach ->
      @post = sinon.stub(utils, "post")
      @referralController.createWithRecipient()
    afterEach ->
      @post.restore()
    it "posts to the correct url with correct data ", ->
      expect(@post).toHaveBeenCalledOnce()
      expect(@post).toHaveBeenCalledWith
        data: @referralController.formatNew @referral
        url: "wala"
    describe "on success", ->
      it "sends event transitionTo editBody", ->
        @send = sinon.stub(@referralController, "send")
        expect(@send).toHaveBeenCalled()

  describe "formatNew", ->
    it "works", ->
      formatted = @referralController.formatNew @content
      expect(formatted.referral_batch_id).toEqual 55
      expect(formatted.referral.recipient_attributes.name).toEqual "sherwin yu"
      expect(formatted.referral.recipient_attributes.email).toEqual "abc@beg.com"
      expect(formatted.referral.recipient_attributes.user_infos_attributes[0].provider).toEqual "FACEBOOK"
      expect(formatted.referral.recipient_attributes.user_infos_attributes[0].name).toEqual "sherwin yu"
      expect(formatted.referral.recipient_attributes.user_infos_attributes[0].uid).toEqual "sherwinxyu"
      expect(formatted.referral.recipient_attributes.user_infos_attributes[0].email).toEqual "abc@beg.com"



