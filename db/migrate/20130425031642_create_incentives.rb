class CreateIncentives < ActiveRecord::Migration
  def self.up
    create_table :incentives do |t|
      t.string :amount
      t.string :name
      t.string :description
      t.string :condition
      t.boolean :free
      t.timestamps
    end
  end

  def self.down
    drop_table :incentives
  end
end
