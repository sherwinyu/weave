class ReferralsController < ApplicationController
  def create_with_recipient
    raise "create_with_recipient should be not be requested with referral content" if params[:referral][:content]
    @referral_batch = ReferralBatch.find params.delete :referral_batch_id
    # normal users should only be able to send recipients if they own the referal batch
    @sender = User.find_by_id params[:referral].delete :sender_id
    @referral = @referral_batch.referrals.create params[:referral]
    @referral.sender = @sender
    render json: @referral
  end

  def my_update
    @referral = Referral.find(params[:id])
    if @referral.update_attributes(params[:referral])
      render json: @referral
    else
      raise "error"
    end
=begin
    respond_to do |format|
      if @referral.update_attributes(params[:referral])
        format.json { head :no_content }
      else
        format.json { render json: @referral.errors, status: :unprocessable_entity }
      end
    end
=end
  end

  # GET /referrals
  # GET /referrals.json
  def index
    @referrals = Referral.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @referrals }
    end
  end

  # GET /referrals/1
  # GET /referrals/1.json
  def show
    @referral = Referral.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @referral }
    end
  end

  # GET /referrals/new
  # GET /referrals/new.json
  def new
    @referral_batch = ReferralBatch.new
    @referral = Referral.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @referral }
    end
  end

  # GET /referrals/1/edit
  def edit
    @referral = Referral.find(params[:id])
  end

  # POST /referrals
  # POST /referrals.json
  def create
    @referral = Referral.new(params[:referral])

    respond_to do |format|
      if @referral.save
        format.html { redirect_to @referral, notice: 'Referral was successfully created.' }
        format.json { render json: @referral, status: :created, location: @referral }
      else
        format.html { render action: "new" }
        format.json { render json: @referral.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /referrals/1
  # PUT /referrals/1.json
  def updatex
    @referral = Referral.find(params[:id])

    respond_to do |format|
      if @referral.update_attributes(params[:referral])
        format.html { redirect_to @referral, notice: 'Referral was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @referral.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /referrals/1
  # DELETE /referrals/1.json
  def destroy
    @referral = Referral.find(params[:id])
    @referral.destroy

    respond_to do |format|
      format.html { redirect_to referrals_url }
      format.json { head :no_content }
    end
  end
end
