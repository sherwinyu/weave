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
      render json: @referral.errors, status: :unprocessable_entity
    end
  end

end
