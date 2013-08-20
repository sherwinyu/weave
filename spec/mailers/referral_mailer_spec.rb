require "spec_helper"

describe ReferralMailer do
  describe "deliver" do
    before :each do
      @referral = create :referral
    end
    context "sender_to_recipient" do
      before :each do
        @mail = ReferralMailer.send :sender_to_recipient, @referral
      end
      it "has proper to and from addresses" do
        @mail.to.should include @referral.recipient_email
        @mail.from.should include @referral.sender_email
      end
      it "" do
        @mail.to.should include @referral.recipient_email
        @mail.from.should include @referral.sender_email
      end
    end
  end
  describe "referral_to_data_hash" do
    before :each do
      @data = ReferralMailer.referral_to_data_hash referral, options
    end
    let (:referral) { create :referral}
    let(:options){ {} }
    context "sender to recipient" do
      it "has the proper data" do
        @data[:to].flatten.should include referral.recipient_email
        @data[:from].flatten.should include referral.sender_email
      end

    end
  end

end
