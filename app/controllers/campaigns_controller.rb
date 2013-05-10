class CampaignsController < ApplicationController
  def new
    @campaign = Campaign.new
  end

  def create
    @campaign = Campaign.new(params[:campaign])
    if @campaign.save
      redirect_to root_url, :notice => "Successfully created campaign."
    else
      render :action => 'new'
    end
  end

  def edit
    @campaign = Campaign.find(params[:id])
  end

  def update
    @campaign = Campaign.find(params[:id])
    if @campaign.update_attributes(params[:campaign])
      redirect_to root_url, :notice  => "Successfully updated campaign."
    else
      render :action => 'edit'
    end
  end
  def show
    @campaign = Campaign.find(params[:id])
    render json: @campaign
  end
end
