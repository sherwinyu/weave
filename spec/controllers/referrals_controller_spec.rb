require 'spec_helper'

describe ReferralsController do

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

end
