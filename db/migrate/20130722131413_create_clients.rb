class CreateClients < ActiveRecord::Migration
  def up
    create_table :clients do |t|
      t.string :name

      t.timestamps
    end
    add_column :campaigns, :client_id, :integer

  end

  def down
    drop_table :clients
    remove_column :campaigns, :client_id
  end
end
