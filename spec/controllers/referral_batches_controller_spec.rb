# require File.dirname(__FILE__) + '/../spec_helper'
require "spec_helper"

describe ReferralBatchesController do

  let(:params) { {referral_batch: @referral_batch_params, format: :json} }
  let(:referral_batch) { build_stubbed :referral_batch }
  let(:sender) { referral_batch.sender }
  let(:campaign) { referral_batch.campaign }
  # let(:recipient) { referral_batch.sender }
  describe "referral_batch_params" do
    let(:params) do
      ActionController::Parameters.new super()
    end
    before :each do
      @referral_batch_params = attributes_for(:referral_batch).merge(
        sender_attributes: attributes_for(:sender).merge(id: sender.id),
        campaign_id: campaign.id)
        @referral_batch_params[:sender_email] = @referral_batch_params[:sender_attributes][:email]
        controller.stub(:params).and_return {params}
    end
    it "converts sender_attribute to sender_id" do
      controller.referral_batch_params.should_not have_key :sender
      controller.referral_batch_params.should have_key :sender_id
      controller.referral_batch_params[:sender_id].should eq sender.id
    end
  end

  describe "#create" do
    before :each do
      @referral_batch_params = { campaign_id: campaign.id }
    end
    describe "subaction: fresh_create" do
      before :each do
        @referral_batch_params[:meta] = {action: "create_fresh"}
        @time = Time.now
        Time.stub(:now).and_return @time
      end
      context "as an independent action" do
        before :each do
          @referral_batch = Referral.new
          subject.instance_variable_set "@referral_batch", @referral_batch
          # This is necessary because we're not "actually" doing this action. this sets up referral_batch params
          expect{post :create_fresh, params}.to raise_error ActionView::MissingTemplate
        end
        it "sets the necessary @attributes re: campaign, sender" do
          assigns(:attributes).keys.should =~ [:campaign_id,
          ].map(& :to_s)
        end
        it "sets valid to .... true" do
          assigns(:valid).should eq true
        end
      end
      context "as a controller action" do
        context "with valid params" do
          before :each do
            ReferralBatch.any_instance.stub(:save).and_return true
          end
          it "creates a @referral_batch with the campaign id" do
            post :create, params
            referral_batch = assigns(:referral_batch)
            referral_batch.campaign_id.should eq @referral_batch_params[:campaign_id]
          end
          it "responds with json" do
            post :create, params
            raw_json = response.body
            json = JSON.parse raw_json

            raw_json.should eq controller.json_for(assigns :referral_batch)
            json.should have_key 'referral_batch'
            json['referral_batch'].should  have_key 'campaign_id'
          end
          pending "creates a @referral_batch with a new unmaterialized user" do
            expect { post :create, params }.to change{User.count}.by 1
            created_user = assigns(:referral_batch).sender
            created_user.should be_persisted
            created_user.should_not be_materialized
            created_user.should_not be_email_provided
            created_user.should_not be_omniauthed
            created_user.visited_at.should eq @time
          end

        end
      end
    end
  end

  describe "#update" do
    let(:params) {super().merge id: @referral_batch.id }
    before :each do
      @referral_batch = referral_batch
      @referral_batch_params = { campaign_id: campaign.id, sender: { } }
      @referral_batch.stub(:save).and_return true
      ReferralBatch.stub(:find).with(@referral_batch.id.to_s).and_return(@referral_batch)
    end
    it "finds the correct ReferralBatch" do
      put :update, params
      ReferralBatch.should have_received(:find).with(@referral_batch.id.to_s)
    end
    describe "subaction: add_sender" do
      let(:referral_batch) {build_stubbed :referral_batch, :no_sender }
      let(:sender) {build_stubbed :sender}
      before :each do
        @referral_batch_params = { sender: {id: sender.id, email: sender.email, email_provided: true }}
        @referral_batch_params[:meta] = {action: "update_add_sender"}
      end
      context "as an independent action" do
        before :each do
          subject.instance_variable_set "@referral_batch", @referral_batch
        end
        before(:each) do
          expect{put :update_add_sender, params}.to raise_error ActionView::MissingTemplate
        end
        it "sets @attributes to :sender_id" do
          assigns(:attributes).keys.should =~ ["sender_id"]
        end
        context "with other parameters (campaign_id)" do
          before(:each) {@referral_batch_params.merge campaign_id: 5}
          it "filters out campaign_id" do
            assigns(:attributes).should_not have_key "campaign_id"
          end
        end
        it "sets valid to true" do
          assigns(:valid).should eq true
        end
      end
      context "as a controller action" do
        it "assigns @referral_batch with the correct sender" do
          put :update, params
          assigns(:referral_batch).sender_id.should eq sender.id
        end
        it "does not create a referral batch" do
          expect{put :update, params}.not_to change {ReferralBatch.count}
        end
      end
    end
  end

  describe "#index" do
    let(:params) { super().merge(@query_params || {}) }
    before :each do
    end
    describe "subaction: lookup_by_email" do
      before(:each) do
        @referral_batch_params = { meta: {action: "lookup_by_email"} }
        @referral_batch = create :referral_batch
        @query_params = { landing_email: @referral_batch.sender_email }
      end
      it "looks up the proper ReferralBatch" do
        get :index, params
        assigns(:referral_batch).should eq @referral_batch
      end
      it "renders a list of a single referral_batch" do
        get :index, params
        json = JSON.parse response.body
        json.should have_key "referral_batches"
        json["referral_batches"].should have(1).referral_batch
      end
      context "when no such referral_batch exists" do
        it "should 404" do
          @query_params = { landing_email: "nonexistent_email" }
          get :index, params
          response.status.should eq 404
          assigns(:referral_batch).should be_nil
        end
      end
    end
    describe "no subaction" do
      it "should render nil" do
        @referral_batch_params = {meta: {}}
        get :index, params
        response.status.should eq 404
      end
    end

  end


  pending "#outreach_show" do
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

      raw_json.should eq controller.json_for(@referral_batch)
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
    pending "sets the current_user's referral_batch"
  end

  pending "#update_sender_email" do
    before :each do
      @sender_email = "valid_email@example.com"
      @sender = create :sender, :without_email
      @referral_batch = create :referral_batch, sender: @sender
    end

    let(:params){ {id: @referral_batch.id, sender_email: @sender_email }}

    context "when sender has no email" do
      it "sets email_provided to true" do
        get :update_sender_email, params
        @referral_batch.reload.sender.email_provided.should be true
      end
      it "sets the email" do
        get :update_sender_email, params
        @referral_batch.reload.sender.email.should eq params[:sender_email]
      end
    end
    context "sender already has email" do
      before :each do
        @sender = create :sender
        @referral_batch = create :referral_batch, sender: @sender
      end
      it "sets email_provided to true" do
        get :update_sender_email, params
        @referral_batch.reload.sender.email_provided.should be true
      end
      it "sets the email" do
        get :update_sender_email, params
        @referral_batch.reload.sender.email.should eq params[:sender_email]
      end
    end
    it "responds with @referral_batch json" do
      get :update_sender_email, params
      response.headers['Content-Type'].should match /json/
    end
    pending "fails if email is invalid" do
    end
    it "fails if no id is given" do
      expect{get :update_sender_email, params.merge(id: 'nonexistent')}.to raise_error
    end
    it "fails if referral_batch has no sender" do
      @referral_batch = create :referral_batch, :no_sender
      expect{get :update_sender_email, params}.to raise_error
    end

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
