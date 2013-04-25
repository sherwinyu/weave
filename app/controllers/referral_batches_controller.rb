class ReferralBatchesController < ApplicationController
  def create
    @referral_batch = ReferralBatch.new(params[:referral_batch])
    if @referral_batch.save
      redirect_to root_url, :notice => "Successfully created referral batch."
    else
      render :action => 'new'
    end
  end

  def new
    @referral_batch = ReferralBatch.new
  end

  def edit
    @referral_batch = ReferralBatch.find(params[:id])
  end

  def update
    @referral_batch = ReferralBatch.find(params[:id])
    if @referral_batch.update_attributes(params[:referral_batch])
      redirect_to root_url, :notice  => "Successfully updated referral batch."
    else
      render :action => 'edit'
    end
  end
end
