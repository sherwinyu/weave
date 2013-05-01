class AddUrlCodesToReferralsAndReferralBatches < ActiveRecord::Migration
  def change
    add_column :referrals, :url_code, :string
  end
end
