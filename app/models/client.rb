class Client < ActiveRecord::Base
  has_many :campaigns
  has_many :referral_batches, through: :campaigns
  has_many :referrals, through: :referral_batches

end
