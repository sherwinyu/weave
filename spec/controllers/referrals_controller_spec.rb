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
      @referral_params.merge!  sender_id: @sender.id,
    end
    let(:params) { super().merge referral_batch_id: @referral_batch.id }

    context "when referral batch doesnt exist" do
      it "raises an error" do
        params.merge! referral_batch_id: 'nonexistent'
        expect {get :create_with_recipient, @params}.to raise_error
      end
    end

    it "raises an error if recipient.content was passed as a param" do
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
  pending "#set_active_referral_helper"
  pending "#set_active_referral_batch_helper"

=begin
  def mock_referral(stubs={})
    (@mock_referral ||= mock_model(Referral).as_null_object).tap do |referral|
      referral.stub(stubs) unless stubs.empty?
    end
  end

  describe "GET index" do
    it "assigns all referrals as @referrals" do
      Referral.stub(:all) { [mock_referral] }
      get :index
      assigns(:referrals).should eq([mock_referral])
    end
  end

  describe "GET show" do
    it "assigns the requested referral as @referral" do
      Referral.stub(:find).with("37") { mock_referral }
      get :show, :id => "37"
      assigns(:referral).should be(mock_referral)
    end
  end

  describe "GET new" do
    it "assigns a new referral as @referral" do
      Referral.stub(:new) { mock_referral }
      get :new
      assigns(:referral).should be(mock_referral)
    end
  end

  describe "GET edit" do
    it "assigns the requested referral as @referral" do
      Referral.stub(:find).with("37") { mock_referral }
      get :edit, :id => "37"
      assigns(:referral).should be(mock_referral)
    end
  end

  describe "POST create" do

    describe "with valid params" do
      it "assigns a newly created referral as @referral" do
        Referral.stub(:new).with({'these' => 'params'}) { mock_referral(:save => true) }
        post :create, :referral => {'these' => 'params'}
        assigns(:referral).should be(mock_referral)
      end

      it "redirects to the created referral" do
        Referral.stub(:new) { mock_referral(:save => true) }
        post :create, :referral => {}
        response.should redirect_to(referral_url(mock_referral))
      end
    end

    describe "with invalid params" do
      it "assigns a newly created but unsaved referral as @referral" do
        Referral.stub(:new).with({'these' => 'params'}) { mock_referral(:save => false) }
        post :create, :referral => {'these' => 'params'}
        assigns(:referral).should be(mock_referral)
      end

      it "re-renders the 'new' template" do
        Referral.stub(:new) { mock_referral(:save => false) }
        post :create, :referral => {}
        response.should render_template("new")
      end
    end

  end

  describe "PUT update" do

    describe "with valid params" do
      it "updates the requested referral" do
        Referral.should_receive(:find).with("37") { mock_referral }
        mock_referral.should_receive(:update_attributes).with({'these' => 'params'})
        put :update, :id => "37", :referral => {'these' => 'params'}
      end

      it "assigns the requested referral as @referral" do
        Referral.stub(:find) { mock_referral(:update_attributes => true) }
        put :update, :id => "1"
        assigns(:referral).should be(mock_referral)
      end

      it "redirects to the referral" do
        Referral.stub(:find) { mock_referral(:update_attributes => true) }
        put :update, :id => "1"
        response.should redirect_to(referral_url(mock_referral))
      end
    end

    describe "with invalid params" do
      it "assigns the referral as @referral" do
        Referral.stub(:find) { mock_referral(:update_attributes => false) }
        put :update, :id => "1"
        assigns(:referral).should be(mock_referral)
      end

      it "re-renders the 'edit' template" do
        Referral.stub(:find) { mock_referral(:update_attributes => false) }
        put :update, :id => "1"
        response.should render_template("edit")
      end
    end

  end

  describe "DELETE destroy" do
    it "destroys the requested referral" do
      Referral.should_receive(:find).with("37") { mock_referral }
      mock_referral.should_receive(:destroy)
      delete :destroy, :id => "37"
    end

    it "redirects to the referrals list" do
      Referral.stub(:find) { mock_referral }
      delete :destroy, :id => "1"
      response.should redirect_to(referrals_url)
    end
  end
=end

end
