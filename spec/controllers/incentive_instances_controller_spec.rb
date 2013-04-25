require File.dirname(__FILE__) + '/../spec_helper'

describe IncentiveInstancesController do
  fixtures :all
  render_views

  it "show action should render show template" do
    get :show, :id => IncentiveInstance.first
    response.should render_template(:show)
  end

  it "edit action should render edit template" do
    get :edit, :id => IncentiveInstance.first
    response.should render_template(:edit)
  end

  it "update action should render edit template when model is invalid" do
    IncentiveInstance.any_instance.stubs(:valid?).returns(false)
    put :update, :id => IncentiveInstance.first
    response.should render_template(:edit)
  end

  it "update action should redirect when model is valid" do
    IncentiveInstance.any_instance.stubs(:valid?).returns(true)
    put :update, :id => IncentiveInstance.first
    response.should redirect_to(incentive_instance_url(assigns[:incentive_instance]))
  end
end
