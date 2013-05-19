class AddSenderAndRecipientEmailToReferrals < ActiveRecord::Migration
  def change
    add_column :referrals, :recipient_email, :string
    add_column :referrals, :sender_email, :string
  end
end
