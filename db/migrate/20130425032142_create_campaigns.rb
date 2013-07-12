class CreateCampaigns < ActiveRecord::Migration
  def change
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

end
