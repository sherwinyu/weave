require File.dirname(__FILE__) + '/../spec_helper'

describe CampaignsController do
  let(:campaign) { build_stubbed :campaign }
  let(:params) { }

  describe "show" do
    let(:params) {{id: campaign.id }}
    before :each do
      Campaign.stub(:find).with(campaign.id.to_s).and_return campaign
      get :show, params
    end
    it "looks up the proper campaign" do
      assigns(:campaign).should be campaign
    end
    describe "json response" do
      before :each do
        @campaign_json = JSON.parse(response.body)["campaign"]
      end
      it "contains id" do
        @campaign_json["id"].should eq campaign.id
      end
      it "contains the embedded client" do
        @campaign_json.should have_key "client"
      end

    end
  end
end
