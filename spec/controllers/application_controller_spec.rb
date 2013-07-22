require File.dirname(__FILE__) + '/../spec_helper'

describe ApplicationController do
  let(:params) {Hash.new}
  # rspec anonymous controller, via
  # https://www.relishapp.com/rspec/rspec-rails/v/2-13/docs/controller-specs/anonymous-controller
  controller do
    def index
      render nothing: true
    end
  end
  describe "#inject_ember_params: filter" do
    let(:params) { super().merge(landing_email: "wagawaga@gmail.com", campaign_id: "555") }
    before :each do
      # controller.stub(:index).and_return
      get :index, params
    end
    it "sets @rails" do
      assigns(:rails).should_not be_nil
    end
    it "sets @rails.landing_email" do
      assigns(:rails)[:landing_email].should eq "wagawaga@gmail.com"
    end
    it "sets @rails.campaign_id" do
      assigns(:rails)[:campaign_id].should eq "555"
    end
    describe "@rails.campaign_id" do
      let(:params) { super().merge campaign_id: nil }
      it "defaults to 1" do
        assigns(:rails)[:campaign_id].should eq 1
      end
    end
  end

  describe "#normalize_params: filter" do

  end
  describe "redirect_always" do
    it "redirects if the uri is http://friends.weaveenergy.com" do
      request.host = "friends.weaveenergy.com"
      get :index, params
      response.should redirect_to "http://www.weaveenergy.com/friends"
    end

    it "redirects if the uri is http://friends.weaveenergy.com" do
      request.host = "staging.weaveenergy.com"
      get :index, params
      response.should redirect_to "http://www.weaveenergy.com/friends"
    end

    it "does not redirect for localhost" do
      request.host = "http://localhost:4000"
      get :index, params
      response.should_not be_redirect
    end

    it "does not redirect for localhost" do
      request.host = "http://localhost:4000"
      get :index, params
      response.should_not be_redirect
    end

  end

end
