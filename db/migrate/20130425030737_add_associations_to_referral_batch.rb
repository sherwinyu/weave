class AddAssociationsToReferralBatch < ActiveRecord::Migration
  def change
    change_table :referral_batches do |t|
      t.belongs_to :campaign
      t.belongs_to :sender
    end
  end
end
