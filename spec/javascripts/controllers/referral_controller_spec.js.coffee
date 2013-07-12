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
        # recipient: @recipient
        customizations: []
        referralBatch: @referralBatch
        sender_email: "sherwinxyu@gmail.com"
      @referralController = Weave.ReferralController.create content: @referral, container: Weave.__container__

  describe "recipientFirstName", ->
    it "binds recipient.name", ->
    it "presents the first name of the recipient", ->

  describe "ceateWithRecipient model", ->
    beforeEach ->
      Ember.testing = false
      @ajax = sinon.stub(jQuery, "ajax")

      @ctrl = sinon.stub(window, 'ctrl')
      mockRb = Ember.Object.create()
      @set = sinon.stub(mockRb, 'set')
      @ctrl.withArgs('referralBatch').returns mockRb

    # the following spec is kind of integrationy-y, but needs to be here because ember data is rather unstable"
    xit "ajaxes with the correct payload", ->
      Ember.run => @referralController.createWithRecipient()
      payload = @ajax.getCall(0).args[0].data
      referral_json =
        referral:
          message: "referral content"
          recipient_email: null
          sender_id: null
          sender_email: "sherwinxyu@gmail.com"
          # TODO include recipient payload
          ###
          recipient:
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
          ###
          # ACTUAL
          ###
customizations: []
message: null
meta: {action:create_with_recipient}
recipient: {name:Lenny Li, email:null, canonical_email:null, email_provided:false, meta:{role:recipient}}
recipient_email: null
referral_batch_id: 20
sender_email: "sherwin.x.yu@gmail.com"
sender_id: 1
          ###
          customizations: []
          referral_batch_id: 1
      expect(payload).toEqual JSON.stringify referral_json

    it "ajaxes with the correct url", ->
      Ember.run => @referralController.createWithRecipient()
      url = @ajax.getCall(0).args[0].url
      expect(url).toEqual "/referrals"

    afterEach ->
      @ajax.restore()
      @ctrl.restore()
      @set.restore()
