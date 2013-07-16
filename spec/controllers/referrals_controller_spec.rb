require 'spec_helper'

describe ReferralsController do
  let(:params) { {referral: @referral_params, format: :json} }
  let(:referral_batch) { create :referral_batch }
  let(:sender) { referral_batch.sender }
  let(:recipient) { referral_batch.sender }

  describe "#create" do
    before :each do
      @referral_params = attributes_for(:referral).merge(
        referral_batch_id: referral_batch.id,
        sender_id: sender.id,
        sender_email: sender.email,
        recipient_attributes: attributes_for(:recipient).merge( user_infos_attributes: [attributes_for(:user_info)] ))
        @referral_params[:recipient_email] = @referral_params[:recipient_attributes][:email]
    end
    pending "sets @referral.attributes to @attributes" do
    end
    pending "saves @referral" do
    end
    pending "responds with @referral" do
    end
    pending "responds with 422 when fails to save" do

    end
    pending "responds with 422 when not @valid" do
      Referral.any_instance.stub(:save).and_return false
      post :create, params
      response.status.should eq 422
    end
    describe "subaction: with_recipient" do
      before :each do
        @referral_params.delete :recipient_email
        @referral_params[:meta] = {action: "create_with_recipient"}
      end
      let(:params) { super().merge referral_batch_id: referral_batch.id }
      context "as an independent action" do
        before :each do
          @referral = Referral.new
          subject.instance_variable_set "@referral", @referral
          # This is necessary because we're not "actually" doing this action. this sets up referral params
          expect{post :create_with_recipient, params}.to raise_error ActionView::MissingTemplate
        end
        it "sets status to Recipient Selected" do
          @referral.status.should eq Referral.STATUSES[:recipient_selected]
        end
        it "returns the necessary attributes re: referral batch, recipient, sender" do
          assigns(:attributes).keys.should =~ [:recipient_attributes, :referral_batch_id, :sender_id, :sender_email].map(& :to_s)
        end
        it "returns valid as true" do
          assigns(:valid).should eq true
        end
        describe "with extraneous parameters" do
          before(:each) { @referral_params[:message] = "wagawaga" }
          it { assigns(:attributes).keys.should_not include "message"}
        end
      end
      context "as a controller action" do
        context "with valid params" do
          it "creates and saves a new recipient and user info if no existing recipient is found" do
            post :create, params
            #  expect{post :create, params}.to change{UserInfo.count}.by 1
            created_referral = assigns(:referral)
            created_referral.status.should eq Referral.STATUSES[:recipient_selected]
            created_referral.message.should be_nil
            created_referral.recipient_email.should be_nil
            created_referral.sender_email.should eq sender.email
          end
          it "assigns @referral with the correct properties" do
            post :create, params
            assigns(:referral).referral_batch_id.should eq referral_batch.id
            assigns(:referral).sender_id.should eq sender.id
            assigns(:referral).recipient.should be_persisted
            assigns(:referral).message.should be_nil
            assigns(:referral).incentives.should be_empty
            assigns(:referral).customizations.should be_empty
          end
          it "responds with @referral json" do
            post :create, params
            raw_json = response.body
            json = JSON.parse raw_json
            json.should have_key "referral"
            json["referral"].should have_key "id"
          end
          it "responds with success" do
            post :create, params
            response.status.should eq 200
          end
          it "does not validate @referral.receivable?" do
            Referral.any_instance.should_not_receive :receivable?
            post :create, params
          end
          pending "looks up the recipient via user info if it already exists"
        end
        context "with invalid params" do
          it "doesn't call create_with_recipient when meta-action is not set" do
            subject.stub(:meta_action).and_return "non_existent_action"
            subject.should_not_receive :create_with_recipient
            post :create, params
          end
          it "responds with errors if invalid: no recipient" do
            @referral_params.delete :recipient_attributes
            post :create, params
            response.status.should eq 422
            json = JSON.parse response.body
            json["referral"]["errors"].to_s.should =~ /Recipient.*present/i
          end
        end
      end
    end

  end

  describe "#update" do
    let(:params) { super().merge id: @referral.id }
    before :each do
      @referral = build_stubbed :referral, :no_recipient_email
      @referral_params = attributes_for(:referral).merge!(
        customization_ids: @referral.product.customization_ids,
        recipient_email: "senders_friend@example.com",
        message: "howdy dooda!",
        recipient_attributes: recipient.attributes.slice( "email", "name" )
      )
      @referral.stub(:save).and_return true
      Referral.stub!(:find).with(@referral.id.to_s).and_return @referral
    end
    it "finds the correct referral" do
      put :update, params
      Referral.should have_received(:find).with(@referral.id.to_s)
    end
    it "cases on meta_action"
    it "calls update_attributes with @attributes"
    describe "subaction: update_body_and_deliver" do
      before(:each) do
        @referral_params[:meta] = {action: "update_body_and_deliver"}
        Referral.any_instance.stub(:deliver).and_return true
      end
      context "as an independent action" do
        before :each do
          subject.instance_variable_set "@referral", @referral
        end
        context "when everything goes as expected" do
          before(:each) do
            @referral.stub(:deliver).and_return true
            # This is necessary because we're not "actually" doing this action. this sets up referral params
            expect{put :update_body_and_deliver, params}.to raise_error ActionView::MissingTemplate
          end
          it "updates the recipient_email attribute" do
            @referral.recipient_email.should eq @referral_params[:recipient_email]
          end
          it "updates referral.recipient.email" do
            @referral.recipient.email.should eq @referral_params[:recipient_attributes]["email"]
          end
          it "does not override name" do
            @referral.recipient.name.should eq attributes_for(:recipient)[:name]
          end
          it "calls @referral.deliver" do
            @referral.should have_received :deliver
          end
          it "sets @referral.status to Attempting Delivery" do
            @referral.status.should eq Referral.STATUSES[:attempting_delivery]
          end
          it "sets @valid to true if everything checks out" do
            assigns(:valid).should eq true
          end
          it "returns the correct attributes re: message, recipient_email, customization_ids" do
            assigns(:attributes).keys.should =~ [:recipient_email, :message, :customization_ids].map(&:to_s)
          end
        end
        it "sets @valid to false when referral fails to deliver" do
          @referral.stub(:deliver).and_return false
          expect{put :update_body_and_deliver, params}.to raise_error ActionView::MissingTemplate
          assigns(:valid).should eq false
        end
        it "sets @valid to false when params is missing a required attribute" do
          @referral_params.delete :message
          expect{put :update_body_and_deliver, params}.to raise_error ActionView::MissingTemplate
          assigns(:valid).should eq false
        end
      end
      context "as an integrated controller action" do
        before(:each) do
          @referral.stub(:save).and_return true
        end
        it "assigns @referral with the correct properties" do
          put :update, params
          assigns(:referral).should be @referral
          @referral.message.should eq @referral_params[:message]
          @referral.customization_ids.should eq @referral_params[:customization_ids]
          @referral.recipient_email.should eq @referral_params[:recipient_email]
        end
        it "does not create a referral" do
          put :update, params
          expect{post :create, params}.not_to change{ Referral.count }
        end

      end

    end
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
  pending "#add_recipient_email" do
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
      expect{put :add_recipient_email, params}.to_not change{User.count}
    end
  end
  pending "#set_active_referral_helper"
  pending "#set_active_referral_batch_helper"

  pending "#update_body" do
    before :each do
      @referral = create :blank_referral
      @referral_params = attributes_for :referral, message: "buy this!"
      @referral_params.merge! customization_ids: @customizations.map(&:id)
    end
    let(:params) { super().merge id: @referral.id }

    it "updates referral's customizations and message" do
      put :update_body, params
      @referral.reload
      @referral.message.should eq @referral_params[:message]
      @referral.customizations.should have(3).customizations
      @referral.customizations.should eq @customizations
    end
    describe "errors" do
      it "responds with errors if message or customizations are invalid"
    end
    pending "requested with referral id and customization ids"
    pending "calls @referral.send if params send"
  end

  describe "#update" do
  end

  describe "strong referral_params" do
    let (:params) do
      ActionController::Parameters.new super()
    end
    before :each do
      @referral_params = attributes_for(:blank_referral).merge(
        recipient_attributes: attributes_for(:recipient).merge( user_infos_attributes: [attributes_for(:user_info)] ))
        @sender = create :sender
        @referral_params.merge!  sender_id: @sender.id
        controller.stub(:params).and_return { params }
    end

    it "converts customization_attributes to customization_ids" do
      @referral_params.merge! customizations_attributes: [{id: 1, description: 'wala'}, {id: 2, description: "wala2"}]
      controller.referral_params.should_not have_key :customizations
      controller.referral_params.should have_key :customization_ids
      controller.referral_params[:customization_ids].should eq [1, 2]
    end

    it "permits message, referral batch id " do
      @referral_params.merge! message: "walawala"
      @referral_params.merge! referral_batch_id: 42
      @referral_params.merge! sender_id: 24
      @referral_params.merge! recipient_email: "wala@recip.org"
      @referral_params.merge! sender_email: "wala@sender.org"
      controller.referral_params[:message].should eq "walawala"
      controller.referral_params[:referral_batch_id].should eq 42
      controller.referral_params[:sender_id].should eq 24
      controller.referral_params[:recipient_email].should eq "wala@recip.org"
      controller.referral_params[:sender_email].should eq "wala@sender.org"
    end
    it "requires :referral"
    it "permits recipient_attributes"
  end


end
