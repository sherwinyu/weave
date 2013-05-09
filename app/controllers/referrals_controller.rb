class ReferralsController < ApplicationController
  def create_with_recipient
    binding.pry
    # raise "create_with_recipient should be not be requested with referral content" if params[:referral][:content]
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
    create_with_recipient
  end
  def show

  end
  def update

  end
  private
  def referral_params
    params.require(:referral).permit :content, {customization_ids: []},
      { recipient_attributes: [:name,
                             :id,
                             :email,
                             {user_infos_attributes: [:name, :email, :provider, :uid]}]
      }
  end
end
