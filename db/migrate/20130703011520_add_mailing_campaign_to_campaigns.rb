class AddMailingCampaignToCampaigns < ActiveRecord::Migration
  def change
    add_column :campaigns, :mailing_campaign, :bool
  end
end
