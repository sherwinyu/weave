class AddLocationFirstLastToUserInfos < ActiveRecord::Migration
  def change
    add_column :user_infos, :location, :string
    add_column :user_infos, :first_name, :string
    add_column :user_infos, :last_name, :string
  end
end
