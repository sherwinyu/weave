require 'spec_helper'

describe Client do
  let(:client) {build_stubbed :client, :with_campaign_referral_batches_and_referrals}
  describe "associations" do
    it "responds to referrals" do
      client.should respond_to :campaigns
      client.should respond_to :referrals
      client.should respond_to :referral_batches
    end

  end
end
