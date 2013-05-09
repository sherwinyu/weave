require 'spec_helper'

describe ReferralsController do
  before :each do
    @customizations = create_list :customization, 3
    @referral_batch = create(:referral_batch)
  end
  let(:params) { {referral: @referral_params, format: :json} }
  describe "#create_with_recipient" do

    before :each do
      @referral_params = attributes_for(:blank_referral).merge(
        recipient_attributes: attributes_for(:recipient).merge( user_infos_attributes: [attributes_for(:user_info)] ))
      @sender = create :sender
      @referral_params.merge!  sender_id: @sender.id
    end
    let(:params) { super().merge referral_batch_id: @referral_batch.id }

    context "when referral batch doesnt exist" do
      it "raises an error" do
        params.merge! referral_batch_id: 'nonexistent'
        expect {get :create_with_recipient, @params}.to raise_error
      end
    end

    pending "raises an error if recipient.content was passed as a param" do
      @params = params
      @params[:referral].merge! content: "You should totally buy this!"
      expect {get :create_with_recipient, @params}.to raise_error /create_with_recipient.*not.*request.*referral.*content/
    end

    it "creates and saves a new recipient and user info if no existing recipient is found" do
      get :create_with_recipient, params
      created_referral = Referral.last
      created_referral.content.should be_nil
    end
    it "assigns @referral with the correct properties" do
      get :create_with_recipient, params
      assigns(:referral).referral_batch.should eq @referral_batch
      assigns(:referral).sender.should eq @sender
      assigns(:referral).recipient.should be_persisted
      assigns(:referral).content.should be_nil
      assigns(:referral).incentives.should be_empty
      assigns(:referral).customizations.should be_empty
    end
    it "responds with @referral json" do
      get :create_with_recipient, params
      raw_json = response.body
      json = JSON.parse raw_json
      json.should have_key "referral"
      json["referral"].should have_key "id"
    end
    pending "sets current_user.referral to @referral"
    pending "responds with errors if invalid"
    pending "looks up the recipient via user info if it already exists"
  end
  describe "#update" do
    before :each do
      @referral = create :blank_referral
      @referral_params = attributes_for :referral, content: "buy this!"
      @referral_params.merge! customization_ids: @customizations.map(&:id)
    end
    let(:params) { super().merge id: @referral.id }

    it "updates referral's customizations and content" do
      get :my_update, params
      @referral.reload
      @referral.content.should eq @referral_params[:content]
      @referral.customizations.should have(3).customizations
      @referral.customizations.should eq @customizations
    end
    describe "errors" do
      it "responds with errors if content or customizations are invalid"
    end
    pending "requested with referral id and customization ids"
    pending "calls @referral.send if params send"
  end
  pending "#update_recipient_email" do
    it "asserts that @referral.recipient exists"
    it "asserts that @referral.recipient.email does not exist"
    it "look up existing users by email"
    it "merges params email to existing recipient"
    it "calls @referral.send if params send"
  end

  describe "#deliver" do
    before :each do
      @referral = create :referral
      Referral.any_instance.stub(:deliver).and_return true
    end
    let(:params){{  id: @referral.id, format: :json } }

    it "looks up the @referral by id" do
      post :deliver, params
      assigns(:referral).should eq @referral
    end
    it "returns an error if no @referral is found" do
      expect {post :deliver, params.merge(id: "nonexistent")}.to raise_error
    end
    it "makes a call to@referral.deliver" do
      Referral.any_instance.should_receive :deliver
      post :deliver, params
    end
    it "returns the @referral if @referral.deliver succeeds" do
      post :deliver, params
      raw_json = response.body
      json = JSON.parse raw_json

      raw_json.should eq controller.json_for @referral.reload
      json.should have_key "referral"
    end
    it "raises an error if @referral.deliver fails" do
      Referral.any_instance.stub(:deliver).and_return false
      expect {post :deliver, params}.to raise_error /delivery failed/
    end

  end
  describe "#add_recipient_email" do
    before :each do
      @recipient_email = "new_email@examples.org"
      @referral = create :referral
      @referral_params = {recipient_attributes: {id: @referral.recipient.id, email: @recipient_email}}
    end
    let(:params) { {id: @referral.id, referral: @referral_params, format: :json} }
    it "looks up @referral by id" do
      get :add_recipient_email, params
      assigns(:referral).should eq @referral
    end
    it "raises error if no referral is found" do
      expect{get :add_recipient_email, params.merge(id: "nonexistent_id")}.to raise_error ActiveRecord::RecordNotFound
    end
    it "raises error if referral is missing recipient" do
      @referral.update_attribute :recipient, nil
      expect{get :add_recipient_email, params}.to raise_error /missing.*recipient/
    end
    it "adds the email if it's valid" do
      get :add_recipient_email, params
      @referral.reload.recipient.email.should eq @recipient_email
    end
    it "should not create a new recipient" do
      expect{get :add_recipient_email, params}.to_not change{User.count}
    end
  end
  pending "#set_active_referral_helper"
  pending "#set_active_referral_batch_helper"

end
