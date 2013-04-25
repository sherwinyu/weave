class CreateIncentiveInstances < ActiveRecord::Migration
  def self.up
    create_table :incentive_instances do |t|
      t.string :code
      t.boolean :claimed, default: false
      t.datetime :claimed_at
      t.datetime :expiration
      t.boolean :for_sender, default: false
      t.boolean :for_recipient, default: false
      t.timestamps

      t.belongs_to :user, null: false
      t.belongs_to :referral
      t.belongs_to :referral_batch
      t.belongs_to :incentive
    end
  end

  def self.down
    drop_table :incentive_instances
  end
end
