class IncentiveInstancesController < ApplicationController
  def show
    @incentive_instance = IncentiveInstance.find(params[:id])
  end

  def edit
    @incentive_instance = IncentiveInstance.find(params[:id])
  end

  def update
    @incentive_instance = IncentiveInstance.find(params[:id])
    if @incentive_instance.update_attributes(params[:incentive_instance])
      redirect_to @incentive_instance, :notice  => "Successfully updated incentive instance."
    else
      render :action => 'edit'
    end
  end
end
