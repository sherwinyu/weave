require File.dirname(__FILE__) + '/../spec_helper'

describe ReferralBatch do
  it "should be valid" do
    ReferralBatch.new.should be_valid
  end
  describe "visit_sender_page" do
    before (:each) do
      @time = Time.now
      Time.stub(:now).and_return @time
    end
    let(:referral_batch) { build_stubbed :referral_batch }
    it "sets sender_page_visited_at to current time" do
      referral_batch.visit_sender_page
      referral_batch.sender_page_visited_at.should eq @time
    end
    it "calls self.sender.visit!" do
      referral_batch.sender.should_receive :visit!
      referral_batch.visit_sender_page
    end
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
