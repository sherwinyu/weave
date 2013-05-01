class AddSenderPageVisitedAtToReferralBatches < ActiveRecord::Migration
  def change
    add_column :referral_batches, :sender_page_visited_at, :datetime
  end
end
