class ReferralBatchesController < ApplicationController
  def show
    @referral_batch = ReferralBatch.find params[:id]
    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @referral_batch }
    end
  end

  # for cases when you're deserializing from url)
  # ASSUMPTIONS:
  #   the referral_batch.sender user is the canonical user for this referral.
  #   we might be missing the case of:: previous materialized user can be identified via cookie and is actually a new outreach'd user
  def outreach_show
    @referral_batch = ReferralBatch.find_by_url_code params[:url_code]
    raise "expected referral batch with url code #{params[:url_code]} to exist" unless @referral_batch
    @referral_batch.visit_sender_page

    @sender = @referral_batch.sender
    @sender.materialize! #TODO(syu): do we want this?? What does materialize mean?!
    respond_to do |format|
      format.json { render json: @referral_batch }
    end
  end

  def fresh_create
    @campaign = Campaign.find params[:campaign_id]
    @referral_batch = @campaign.referral_batches.create
    @referral_batch.create_sender!
    @referral_batch.sender.visit!
    render json: nil
  end

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
