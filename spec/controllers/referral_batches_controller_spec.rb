# require File.dirname(__FILE__) + '/../spec_helper'
require "spec_helper"

describe ReferralBatchesController do
  describe "#outreach_show" do
    before :each do
      @referral_batch = create :referral_batch, url_code: "zcbmnvx01"
      @params = { url_code: "zcbmnvx01", format: :json }

      User.any_instance.stub(:materialize!)
      ReferralBatch.any_instance.stub(:visit_sender_page).and_return false
    end

    it "responds with json" do
      get :outreach_show, @params
      raw_json = response.body
      json = JSON.parse raw_json

      raw_json.should == controller.json_for(@referral_batch)
      json.should have_key "referral_batch"
    end

    it "visits_sender_page of @referral_batch" do
      ReferralBatch.any_instance.should_receive :visit_sender_page
      get :outreach_show , @params
    end

    it "looks up and assigns referral_batch by url code"
    it "raises an error when no referral_batch exists with that url code"
    it "responds with json referral_batch, including id, campaign (sender incentives, recipient incentives, product and customizations)" do end


  end
end
=begin
  it "create action should render new template when model is invalid" do
    ReferralBatch.any_instance.stubs(:valid?).returns(false)
    post :create
    response.should render_template(:new)
  end

  it "create action should redirect when model is valid" do
    ReferralBatch.any_instance.stubs(:valid?).returns(true)
    post :create
    response.should redirect_to(root_url)
  end

  it "new action should render new template" do
    get :new
    response.should render_template(:new)
  end

  it "edit action should render edit template" do
    get :edit, :id => ReferralBatch.first
    response.should render_template(:edit)
  end

  it "update action should render edit template when model is invalid" do
    ReferralBatch.any_instance.stubs(:valid?).returns(false)
    put :update, :id => ReferralBatch.first
    response.should render_template(:edit)
  end

  it "update action should redirect when model is valid" do
    ReferralBatch.any_instance.stubs(:valid?).returns(true)
    put :update, :id => ReferralBatch.first
    response.should redirect_to(root_url)
  end
=end
