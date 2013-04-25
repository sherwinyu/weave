class UpdateReferrals < ActiveRecord::Migration
  def change
    change_table :referrals do |t|
      t.boolean :delivered, default: false
      t.datetime :delivered_at
      t.boolean :recipient_opened
      t.datetime :recipient_opened_at
      t.boolean :converted

      t.belongs_to :campaign
      t.belongs_to :referral_batch
      t.remove :recipient_info_id
    end
  end
end
