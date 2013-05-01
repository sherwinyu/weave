class AddUrlCodesToReferralsAndReferralBatches < ActiveRecord::Migration
  def change
    add_column :referrals, :url_code, :string
    add_column :referral_batches, :url_code, :string
  end
end
