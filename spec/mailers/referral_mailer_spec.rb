require "spec_helper"

describe ReferralMailer do
  describe "sender to recipient" do
    before :each do
      @referral = build :referral
      @mail = ReferralMailer.sender_to_recipient @referral
    end
    it "has proper to and from addresses" do
      @mail.to.should include @referral.recipient_email
      @mail.from.should include @referral.sender_email
    end
  end

end
