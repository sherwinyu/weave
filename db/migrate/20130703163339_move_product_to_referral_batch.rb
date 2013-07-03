class MoveProductToReferralBatch < ActiveRecord::Migration
  def up
    change_table :referral_batches do |t|
      t.references :product
    end
    ReferralBatch.all.each do |rb|
      rb.update_attribute :product_id, rb.try(:campaign).try(:product_id)
    end
  end

  def down
    raise "this is a one way street buddy!"
  end
end
