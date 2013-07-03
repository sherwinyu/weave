class AddMailchimpToCampaign < ActiveRecord::Migration
  def change
    add_column :campaigns, :mailchimp_campaign, :string
    add_column :campaigns, :mailchimp_list, :string
  end
end
