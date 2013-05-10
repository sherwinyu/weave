# == Schema Information
#
# Table name: incentive_instances
#
#  id                :integer          not null, primary key
#  code              :string(255)
#  claimed           :boolean          default(FALSE)
#  claimed_at        :datetime
#  expiration        :datetime
#  for_sender        :boolean          default(FALSE)
#  for_recipient     :boolean          default(FALSE)
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  user_id           :integer          not null
#  referral_id       :integer
#  referral_batch_id :integer
#  incentive_id      :integer
#

class IncentiveInstance < ActiveRecord::Base
  attr_accessible :code, :claimed, :claimed_at, :expiration, :for_sender, :for_recipient
  
  belongs_to :user
  belongs_to :referral
  belongs_to :referal_batch
  belongs_to :incentive
end
