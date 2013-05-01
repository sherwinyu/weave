require 'spec_helper'

describe Referral do
  pending "#send" do
    it "sets sent_at to now"
    it "sets sent to true"
    context "via email" do
      it "raises an error if no email is found"
    end
    context "via facebook" do
    end
  end
  pending "validations" do
    it "can't modify sent messages"
    it "validates incentives"
    it "validates customizations"
  end
  pending "#attach_incentive_instances"

end
