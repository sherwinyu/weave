class Incentive < ActiveRecord::Base
  attr_accessible :amount, :name, :description, :condition, :free
  has_many :instances
  has_many :referrals, through: :instances
  has_and_belongs_to_many :campaigns_used_as_recipient_incentive, class_name: "Campaign", join_table: "campaigns_recipient_incentives"
  has_and_belongs_to_many :campaigns_used_as_sender_incentive, class_name: "Campaign", join_table: "campaigns_sender_incentives"

  def campaigns
    # TODO(syu): grab all ampaigns
  end
end
