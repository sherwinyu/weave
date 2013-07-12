class AddMailchimpToCampaign < ActiveRecord::Migration
  def change
    add_column :campaigns, :mailchimp_campaign_id, :string
    add_column :campaigns, :mailchimp_list_id, :string
  end
end
