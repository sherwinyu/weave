class RenameContentFields < ActiveRecord::Migration
  def change
    rename_column :customizations, :content, :description
    rename_column :referrals, :content, :message
  end
end
