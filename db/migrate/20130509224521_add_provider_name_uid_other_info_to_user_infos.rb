class AddProviderNameUidOtherInfoToUserInfos < ActiveRecord::Migration
  def change
    add_column :user_infos, :provider, :string
    add_column :user_infos, :name, :string
    add_column :user_infos, :uid, :string
    add_column :user_infos, :other_info, :string
  end
end
