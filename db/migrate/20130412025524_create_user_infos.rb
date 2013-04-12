class CreateUserInfos < ActiveRecord::Migration
  def change
    create_table :user_infos do |t|
      t.string :email
      t.integer :user_id

      t.timestamps
    end
  end
end
