class AllowEmaillessUsers < ActiveRecord::Migration
  def up
    remove_column :users, :email
    add_column :users, :email, :string
  end

  def down
    remove_column :users, :email
    add_column :users, :email, :string, null: false, default: ""
  end
end
