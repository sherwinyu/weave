class CreateCustomizations < ActiveRecord::Migration
  def change
    create_table :customizations do |t|
      t.string :content
      t.integer :product_id

      t.timestamps
    end
  end
end
