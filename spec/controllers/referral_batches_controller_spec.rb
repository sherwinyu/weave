require File.dirname(__FILE__) + '/../spec_helper'

describe ReferralBatchesController do
  describe "#outreach_show" do
    before :each do
      @rb = create :ReferralBatch
    end

    it "responds with only json" do
      puts @rb
    end
    it "calls ReferralBatch.visited_by_url_code using the url_code"
    it "assigns referral_batch" 
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
