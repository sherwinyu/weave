class CreateReferralBatches < ActiveRecord::Migration
  def self.up
    create_table :referral_batches do |t|
      t.boolean :sender_page_visited
      t.boolean :sender_page_personalized
      t.boolean :outreach_email_sent
      t.timestamps
    end
  end

  def self.down
    drop_table :referral_batches
  end
end
