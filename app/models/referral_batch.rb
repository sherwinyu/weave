class ReferralBatch < ActiveRecord::Base
  attr_accessible :sender_page_visited, :sender_page_personalized, :outreach_email_sent
  belongs_to :sender, class_name: "User", inverse_of: :referral_batches
  has_many :sent_referrals, class_name: "Referral", inverse_of: :referral_batch
  belongs_to :campaign, inverse_of: :referral_batches
  has_many :sender_incentives, class_name: "IncentiveInstance", inverse_of: :referral_batch
end
