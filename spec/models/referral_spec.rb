require 'spec_helper'

describe Referral do
  let(:referral) { create :referral, :not_delivered }
  before :each do
    @time = Time.now
    Time.stub(:now).and_return @time
  end
  describe "#deliver" do
    context "all good" do
      before :each do
        @referral = referral
        @ret = @referral.deliver
      end
      it "sets sent_at to now" do
        @referral.delivered_at.should eq @time
      end
      it "sets delivered to true" do
        @referral.should be_delivered
      end
      it "returns true" do
        @ret.should be true
      end
      it "can't be redelivered" do
        @referral.deliver.should be false
        @referral.errors[:deliverable].to_s.should match /already delivered/i
      end
    end
    context "invalid" do
      # TODO(syu): stub these
      it "adds an error if missing sender" do
        referral.update_attribute :sender, nil
        referral.deliver.should be false
        referral.errors[:sender_email].to_s.should match /sender/i
      end
      it "adds an error if no sender email" do
        referral.sender.update_attribute :email, nil
        referral.deliver.should be false
        referral.errors[:sender_email].to_s.should match /sender/i
      end

      it "adds an error if sender email not confirmed" do
        referral.sender.update_attribute :email_provided, false
        referral.deliver.should be false
        referral.errors[:sender_email].to_s.should match /sender.*unconfirmed/i
      end

      it "adds an error if missing recipient" do
        referral.update_attribute :recipient, nil
        referral.deliver.should be false
        referral.errors[:recipient_email].to_s.should match /recipient/i
      end
      it "adds an error if no recipient email" do
        referral.recipient.update_attribute :email, nil
        referral.deliver.should be false
        referral.errors[:recipient_email].to_s.should match /recipient/i
      end

      it "adds an error if no recipient email" do
        referral.recipient.update_attribute :email, nil
        referral.deliver.should be false
        referral.errors[:recipient_email].to_s.should match /recipient/i
      end
    end
  end
  pending "validations" do
    it "can't modify sent messages"
    it "validates incentives"
    it "validates customizations"
  end
  pending "#attach_incentive_instances"
end
