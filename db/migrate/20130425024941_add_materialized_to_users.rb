class AddMaterializedToUsers < ActiveRecord::Migration
  def change
    add_column :users, :materialized, :boolean, default: false
  end
end
