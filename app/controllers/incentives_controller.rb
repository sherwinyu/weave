class IncentivesController < ApplicationController
  def new
    @incentive = Incentive.new
  end

  def create
    @incentive = Incentive.new(params[:incentive])
    if @incentive.save
      redirect_to @incentive, :notice => "Successfully created incentive."
    else
      render :action => 'new'
    end
  end

  def edit
    @incentive = Incentive.find(params[:id])
  end

  def update
    @incentive = Incentive.find(params[:id])
    if @incentive.update_attributes(params[:incentive])
      redirect_to @incentive, :notice  => "Successfully updated incentive."
    else
      render :action => 'edit'
    end
  end

  def show
    @incentive = Incentive.find(params[:id])
  end
end
