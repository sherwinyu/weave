class AddForeignKeysToReferrals < ActiveRecord::Migration
  def change
    add_column :referrals, :recipient_id, :integer
    add_column :referrals, :sender_id, :integer
    add_column :referrals, :recipient_info_id, :integer
    add_column :referrals, :product_id, :integer
  end
end
