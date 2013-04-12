class CreateJoinTables < ActiveRecord::Migration
  def change
    create_table :customizations_referrals, id: false do |t|
      t.references :customization, :referral
    end
    create_table :customizations_segments, id: false do |t|
      t.references :customization, :segment
    end
    create_table :products_segments, id: false do |t|
      t.references :product, :segment
    end
  end
end
