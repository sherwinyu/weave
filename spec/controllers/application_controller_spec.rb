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
  describe "client_from_domain" do
    let(:client) do
      build :client
    end
    before :each do
      Client.stub(:find_by_key).and_return client
      controller.stub(:environment_tag).and_return environment_tag
      request.host = host
    end
    context "environment: production" do
      let(:environment_tag){""}
      context "e3.weaveenergy.com" do
        let(:host){"e3.weaveenergy.com"}
        it "calls Client.find_by_key with the proper key" do
          ret = controller.client_from_domain
          Client.should have_received(:find_by_key).with("e3")
          ret.should be client
        end
      end
    end
    context "environment: staging" do
      let(:environment_tag){"staging-"}
      context "e3.weaveenergy.com" do
        let(:host){"e3.weaveenergy.com"}
        it "raises an error" do
          expect{ client = controller.client_from_domain }.to raise_error
        end
      end

      context "staging-e3.weaveenergy.com" do
        let(:host){"staging-e3.weaveenergy.com"}
        it "calls Client.find_by_key e3" do
          ret = controller.client_from_domain
          Client.should have_received(:find_by_key).with("e3")
          ret.should be client
        end
      end

    end
  end
  describe "compute_campaign_id" do
    before :each do
      # Campaign.stub(:find).with(:
      controller.stub(:client_from_domain).and_return client
      controller.params = params
    end
    let(:params) { {campaign_id: campaign_id} }
    let(:campaign_id) { client.campaigns.first.id }
    let(:client) do
      client = build_stubbed(:client, :with_campaigns)
    end
    context "without a campaign_id param" do
      let(:params) {{}}
      it "returns the id of the first campaign of the client" do
        ret = controller.compute_campaign_id
        ret.should eq client.campaigns.first.id
      end
    end

    context "with a campaign_id param matching the client_from_domain" do
      let(:campaign_id) { client.campaigns.last.id }
      it "returns the campaign_id as specified by the param" do
        ret = controller.compute_campaign_id
        ret.should eq campaign_id
      end
    end

    context "with a campaign_id param invalid for the client" do
      let(:campaign_id) { '5555' }
      it "returns the default campaign_id for the client" do
        ret = controller.compute_campaign_id
        ret.should eq client.campaigns.first.id
        ret.should_not be '5555'
      end
    end

  end
  pending "redirect_always" do
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
