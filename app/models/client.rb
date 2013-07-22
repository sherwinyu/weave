# == Schema Information
#
# Table name: clients
#
#  id         :integer          not null, primary key
#  name       :string(255)
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Client < ActiveRecord::Base
  has_many :campaigns
  has_many :referral_batches, through: :campaigns
  has_many :referrals, through: :referral_batches

end
