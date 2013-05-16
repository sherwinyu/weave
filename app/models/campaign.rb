# == Schema Information
#
# Table name: campaigns
#
#  id                     :integer          not null, primary key
#  name                   :string(255)
#  description            :text(255)
#  outreach_email_content :text(255)
#  sender_page_content    :text(255)
#  recipient_page_content :text(255)
#  live                   :boolean
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  product_id             :integer
#

class Campaign < ActiveRecord::Base
  attr_accessible :name, :description, :outreach_email_content, :sender_page_content, :recipient_page_content, :live, :product

  has_and_belongs_to_many :sender_incentives, class_name: "Incentive", join_table: "campaigns_sender_incentives"
  has_and_belongs_to_many :recipient_incentives, class_name: "Incentive", join_table: "campaigns_recipient_incentives"

  has_many :referral_batches
  has_many :referrals, through: :referral_batches, inverse_of: :campaign
  has_many :senders, through: :referral_batches
  has_many :recipients, through: :referral_batches
  belongs_to :product, inverse_of: :campaigns
end
