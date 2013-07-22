class CreateClients < ActiveRecord::Migration
  def change
    create_table :clients do |t|
      t.string :name

      t.timestamps
    end
    add_column :campaigns, :client_id, :integer

  end
end
