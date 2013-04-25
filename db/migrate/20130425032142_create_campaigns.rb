class CreateCampaigns < ActiveRecord::Migration
  def self.up
    create_table :campaigns do |t|
      t.string :name
      t.string :description
      t.string :outreach_email_content
      t.string :sender_page_content
      t.string :recipient_page_content
      t.boolean :live
      t.timestamps

      t.references :product
    end
  end

  def self.down
    drop_table :campaigns
  end
end
