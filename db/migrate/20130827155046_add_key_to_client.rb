class AddKeyToClient < ActiveRecord::Migration
  def change
    add_column :clients, :key, :string
  end
end
