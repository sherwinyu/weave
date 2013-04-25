class IncentiveInstance < ActiveRecord::Base
  attr_accessible :code, :claimed, :claimed_at, :expiration, :for_sender, :for_recipient
  
  belongs_to :user
  belongs_to :referral
  belongs_to :referal_batch
  belongs_to :incentive
end
