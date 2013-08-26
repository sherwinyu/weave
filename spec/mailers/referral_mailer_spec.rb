require "spec_helper"

describe ReferralMailer do
  describe "deliver" do
    let (:customization) do
      build :customization, description: 'waga waga'
    end
    let (:referral) do
      r = create :referral
      r.customizations << customization
      r
    end
    context "method: sender_to_recipient_referral_newliving" do
      before :each do
        ReferralMailer.should_receive(:sender_to_recipient_referral_newliving).and_call_original
        ReferralMailer.deliver referral, options
      end
      let(:options){ {method: :sender_to_recipient_referral_newliving} }
      it "calls sender_to_recipient_referral_newliving with the referral" do
        ReferralMailer.should have_received(:sender_to_recipient_referral_newliving).with referral, an_instance_of(Hash)
      end
    end

    context "method: sender_to_recipient" do
      before :each do
        ReferralMailer.should_receive(:sender_to_recipient).and_call_original
        ReferralMailer.deliver referral, options
      end
      let(:options){ {method: :sender_to_recipient} }
      it "calls sender_to_recipient_referral_newliving with the referral" do
        ReferralMailer.should have_received(:sender_to_recipient).with referral, an_instance_of(Hash)
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
