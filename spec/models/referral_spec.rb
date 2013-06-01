require 'spec_helper'

describe Referral do
  let(:referral) { build :referral, :not_delivered }
  before :each do
    @time = Time.now
    Time.stub(:now).and_return @time
  end

  describe "#deliver" do
    context "when sendable, receivable, and not delivered yet" do
      before :each do
        @referral = referral
        @mailgun_send = @referral.should_receive(:mailgun_send)
        @ret = @referral.deliver
      end

      it "sets sent_at to now" do
        # @ret = @referral.deliver
        @referral.delivered_at.should eq @time
      end

      it "sets delivered to true" do
        @referral.should be_delivered
      end

      it "returns true" do
        @ret.should be true
      end

      it "calls mailgun_send" do
        @referral.should have_received :mailgun_send
      end

      it "prevents the referral from getting delivered twice" do
        @referral.deliver.should be false
        @referral.errors[:deliverable].to_s.should match /already delivered/i
      end
    end
    context "invalid" do
      it "checks for deliverable" do
        @referral = referral
        Referral.any_instance.stub(:deliverable?).and_return false
        @referral.deliver.should be false
        @referral.should_not be_delivered
      end

    end
  end
  describe "validations" do

    describe "deliverable?" do
      it "is valid if sendable and receivable and message is not already delivered" do
        referral.deliverable?.should be true
      end
      it "is invalid unless sendable" do
        referral.stub(:sendable?).and_return false
        referral.deliverable?.should be false
      end
      it "is invalid unless receivable" do
        referral.stub(:receivable?).and_return false
        referral.deliverable?.should be false
      end

      it "is invalid if message was already delivered" do
        referral.stub(:delivered?).and_return true
        referral.deliverable?.should be false
        referral.errors[:deliverable].to_s.should match /already/i
      end

      it "is invalid if message is unsendable or unreceivable" do
        referral.stub(:delivered?).and_return true
        referral.deliverable?.should be false
        referral.errors[:deliverable].to_s.should match /already/i
      end

    end
    describe "sendable?" do
      it "is invalid if sender_email doesn't exist" do
        referral.update_attribute :sender_email, nil
        referral.sendable?.should be false
        referral.errors[:sender_email].to_s.should match /sender.*invalid/i
      end
      it "is invalid if sender_email isn't valid email address" do
        referral.update_attribute :sender_email, "not an email addr!"
        referral.sendable?.should be false
        referral.errors[:sender_email].to_s.should match /sender.*invalid/i
      end
    end
    describe "receivable?" do
      it "is adds an error if there is no receiver_email" do
        referral.update_attribute :recipient_email, nil
        referral.receivable?.should be false
        referral.errors[:recipient_email].to_s.should match /recipient.*invalid/i
      end
      it "is invalid if recipient_email isn't valid email address" do
        referral.update_attribute :recipient_email, "not an email addr!"
        referral.receivable?.should be false
        referral.errors[:recipient_email].to_s.should match /recipient.*invalid/i
      end
    end

  end
  pending "validations" do
    it "can't modify sent messages"
    it "validates incentives"
    it "validates customizations"
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
  pending "#attach_incentive_instances"
end
