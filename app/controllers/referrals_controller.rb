class ReferralsController < ApplicationController
  def create_with_recipient
    # raise "create_with_recipient should be not be requested with referral message" if params[:referral][:message]
    @referral_batch = ReferralBatch.find params.delete :referral_batch_id
    # normal users should only be able to send recipients if they own the referal batch
    @sender = User.find_by_id params[:referral].delete :sender_id
    @referral = @referral_batch.referrals.create referral_params
    @referral.sender = @sender
    render json: @referral
  end

  def update_body
    @referral = Referral.find(params[:id])
    if @referral.update_attributes referral_params
      render json: @referral
    else
      render json: @referral.errors, status: :unprocessable_entity
    end
  end

  def deliver
    @referral = Referral.find(params[:id])
    if @referral.deliver
      render json: @referral
    else
      raise "delivery failed"
    end
  end
  def add_recipient_email
    @referral = Referral.find(params[:id])
    raise "referral is missing recipient" unless @referral.recipient
    if @referral.update_attributes referral_params
      render json: @referral
    else
      raise "invalid"
    end
  end
  def new
    @referral = Referral.new
  end
  def create
    @sender = User.find_by_id params[:referral].delete :sender_id
    @referral = Referral.create referral_params
    @referral.sender = @sender
    if @referral.save
      render json: @referral
    else
      render json: @referral, status: 422
    end

    # create_with_recipient
  end
  def show
    @referral = Referral.find params[:id]
    render json: @referral
  end
  def update
    @referral = Referral.find(params[:id])
    if @referral.update_attributes referral_params
      render json: @referral
    else
      render json: @referral, status: 422
    end
  end
  private
  def referral_params
    params[:referral][:customization_ids] = params[:referral].delete(:customizations).map{|c| c[:id]} if params[:referral][:customizations]
    params.require(:referral).permit :message, :referral_batch_id, {customization_ids: []},
      { recipient_attributes: [:name,
                             :id,
                             :email,
                             {user_infos_attributes: [:name, :email, :provider, :uid]}]
      }
  end
end
