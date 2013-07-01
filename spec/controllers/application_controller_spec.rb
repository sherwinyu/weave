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
    let(:params) { super().merge(landing_email: "wagawaga@gmail.com") }
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
  end

  describe "#normalize_params: filter" do

  end

  describe "#normalize_params: filter" do

  end

end
