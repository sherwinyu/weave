class CreateSegments < ActiveRecord::Migration
  def change
    create_table :segments do |t|
      t.string :description

      t.timestamps
    end
  end
end
