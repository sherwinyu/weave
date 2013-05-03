# require File.dirname(__FILE__) + '/../spec_helper'
require "spec_helper"

describe ReferralBatchesController do
  describe "#fresh_create" do
    let(:params) { {campaign_id: @campaign.id, format: :json} }
    before :each do
      @campaign = create :campaign
      @time = Time.now
      Time.stub(:now).and_return @time
    end

    it "creates a @referral_batch with the campaign id" do
      expect { post :fresh_create, params }.to change{ReferralBatch.count}.by 1
      referral_batch = assigns(:referral_batch)
      referral_batch.should be_persisted
      referral_batch.campaign.should eq @campaign
    end
    it "creates a @referral_batch with a new unmaterialized user" do
      expect { post :fresh_create, params }.to change{User.count}.by 1
      created_user = assigns(:referral_batch).sender
      created_user.should be_persisted
      created_user.should_not be_materialized
      created_user.should_not be_email_provided
      created_user.should_not be_omniauthed
      created_user.visited_at.should eq @time
    end
    it "responds with json" do
      post :fresh_create, params
    end
  end

  describe "#outreach_show" do
    before :each do
      @referral_batch = create :referral_batch, url_code: "zcbmnvx01"
      @params = { url_code: "zcbmnvx01", format: :json }

      User.any_instance.stub(:materialize!)
      ReferralBatch.any_instance.stub(:visit_sender_page).and_return false
    end

    it "responds with @referral_batch json" do
      get :outreach_show, @params
      raw_json = response.body
      json = JSON.parse raw_json

      raw_json.should == controller.json_for(@referral_batch)
      json.should have_key "referral_batch"
      #TODO(syu): add additional tests for json output
    end

    it "visits_sender_page of @referral_batch" do
      ReferralBatch.any_instance.should_receive :visit_sender_page
      get :outreach_show , @params
    end

    it "looks up and assigns referral_batch by url code" do
      get :outreach_show , @params
      assigns(:referral_batch).should eq @referral_batch
    end
    it "raises an error when no referral_batch exists with that url code" do
      @params.merge! url_code: "nonexistent_code"
      expect {get :outreach_show, @params}.to raise_error /referral batch.*url code.*to exist/
    end
    pending "it sets the current_user's referral_batch"
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
