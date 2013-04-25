class CreateAssociationsForNewIncentiveStructure < ActiveRecord::Migration
  def change
    create_table :campaigns_recipient_incentives, id: false do |t|
      t.references :campaign, :incentive
    end

    create_table :campaigns_sender_incentives, id: false do |t|
      t.references :campaign, :incentive
    end

    remove_column :referrals, :campaign_id
  end

end
