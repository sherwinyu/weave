class CreateClients < ActiveRecord::Migration
  def up
    create_table :clients do |t|
      t.string :name

      t.timestamps
    end
    add_column :campaigns, :client_id, :integer

    logger.info "Creating clients table"
    client = Client.find_or_initialize_by_name "New Living"
    logger.info "find or initialize by name for new living: #{client}"
    client.save(validate: false)
    Product.where(client_id: nil).update_all client_id: client.id
    Client.where(client_id: nil).update_all client_id: client.id
  end
  def down
    drop_table :clients
    remove_column :campaigns, :client_id
  end
end
