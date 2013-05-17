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
    # @sender.materialize! #TODO(syu): do we want this?? What does materialize mean?!
    render json: @referral_batch
  end

  def fresh_create
    @campaign = Campaign.find params[:campaign_id]
    @referral_batch = @campaign.referral_batches.create
    @referral_batch.create_sender!
    @referral_batch.sender.visit! # TODO(syu): should be dependant on whether we're in-store ?
    render json: @referral_batch
  end

  def update_sender_email
    @referral_batch = ReferralBatch.find(params[:id])
    @sender = @referral_batch.sender
    @sender.email = params[:sender_email]
    if @referral_batch.save
      @sender.update_attribute :email_provided, true
      render json: @referral_batch
    else
      render json: "error"
    end
  end

  def create
    @referral_batch = ReferralBatch.new referral_batch_params
    if @referral_batch.save
      render json: @referral_batch
    else
      render json: @referral_batch, status: 422
    end
  end

  def new
    @referral_batch = ReferralBatch.new
  end

  def edit
    @referral_batch = ReferralBatch.find(params[:id])
  end
  # TODO(syu): don't be such a hack
  def update_sender_email
    @user = User.find(params[:id])
    @user.email = params[:user_email]
    @user.save
    render json: @user
  end

  def update
    @referral_batch = ReferralBatch.find(params[:id])
    if @referral_batch.update_attributes referral_batch_params
      render json: @referral_batch
    else
      render json: @referral_batch, status: 422
    end
  end
  private
  def referral_batch_params
    params[:referral_batch][:sender_id] = params[:referral_batch].delete(:sender_attributes)[:id] if params[:referral_batch][:sender_attributes]
    params.require(:referral_batch).permit :campaign_id, :sender_page_visited, :sender_page_personalized, :sender_id


  end
end
