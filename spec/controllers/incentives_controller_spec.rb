require File.dirname(__FILE__) + '/../spec_helper'

describe IncentivesController do
  fixtures :all
  render_views

  it "new action should render new template" do
    get :new
    response.should render_template(:new)
  end

  it "create action should render new template when model is invalid" do
    Incentive.any_instance.stubs(:valid?).returns(false)
    post :create
    response.should render_template(:new)
  end

  it "create action should redirect when model is valid" do
    Incentive.any_instance.stubs(:valid?).returns(true)
    post :create
    response.should redirect_to(incentive_url(assigns[:incentive]))
  end

  it "edit action should render edit template" do
    get :edit, :id => Incentive.first
    response.should render_template(:edit)
  end

  it "update action should render edit template when model is invalid" do
    Incentive.any_instance.stubs(:valid?).returns(false)
    put :update, :id => Incentive.first
    response.should render_template(:edit)
  end

  it "update action should redirect when model is valid" do
    Incentive.any_instance.stubs(:valid?).returns(true)
    put :update, :id => Incentive.first
    response.should redirect_to(incentive_url(assigns[:incentive]))
  end

  it "show action should render show template" do
    get :show, :id => Incentive.first
    response.should render_template(:show)
  end
end
