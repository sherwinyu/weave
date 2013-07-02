class AddSenderEmailToReferralBatch < ActiveRecord::Migration
  def change
    add_column :referral_batches, :sender_email, :string
  end
end
