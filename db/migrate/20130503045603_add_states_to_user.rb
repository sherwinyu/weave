class AddStatesToUser < ActiveRecord::Migration
  def change
    add_column :users, :email_provided, :boolean
    add_column :users, :omniauthed, :boolean
    add_column :users, :visited_at, :datetime
  end
end
