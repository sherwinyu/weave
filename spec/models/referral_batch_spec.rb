require File.dirname(__FILE__) + '/../spec_helper'

describe ReferralBatch do
  it "should be valid" do
    ReferralBatch.new.should be_valid
  end
  describe "self.visited_by_url_code" do
    pending "returns the ReferralBatch with the url_code"
    pending "sets referral_page_visited to true"
    pending "sets referral_page_visited_at to current time"
    pending "raises an error if no referral batch url is found"
  end
  pending "validations" do
    it "included referrals must share customizations"
  end
  pending "#attach_sender_incentive_instances"
end
