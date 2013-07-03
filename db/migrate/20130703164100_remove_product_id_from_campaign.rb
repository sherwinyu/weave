class RemoveProductIdFromCampaign < ActiveRecord::Migration
  def up
    remove_column :campaigns, :product_id
  end

  def down
    add_column :campaigns, :product_id, :integer
  end
end
