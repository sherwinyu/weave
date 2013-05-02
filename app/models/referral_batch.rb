class ReferralBatch < ActiveRecord::Base
  attr_accessible :sender_page_visited, :sender_page_personalized, :outreach_email_sent

  belongs_to :sender, class_name: "User", inverse_of: :referral_batches
  has_many :referrals, inverse_of: :referral_batch
  belongs_to :campaign, inverse_of: :referral_batches
  has_many :sender_incentives, class_name: "IncentiveInstance", inverse_of: :referral_batch

  def visit_sender_page
    raise "wala"
  end
  def build_referral
    # TODO(syu): look at association extensions //
    # http://stackoverflow.com/questions/2890761/rails-overriding-activerecord-association-method
  end
end
