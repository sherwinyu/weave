class ReferralBatch < ActiveRecord::Base
  attr_accessible :sender_page_visited, :sender_page_personalized, :outreach_email_sent
  belongs_to :sender, class_name: "User"
  has_many :sent_referrals, class_name: "Referral"
  belongs_to :campaign
  has_many :sender_incentives, class_name: "IncentiveInstance"
end
