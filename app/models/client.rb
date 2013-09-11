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
  has_many :campaigns, inverse_of: :client
  has_many :referral_batches, through: :campaigns
  has_many :referrals, through: :referral_batches
  has_many :products, inverse_of: :client
  has_many :customizations, through: :products
  def clean!
    logger.info "cleaning client #{id} #{name}"
    logger.info "deleting campaigns: #{self.campaigns.destroy_all}"
    logger.info "deleting referrals: #{self.referrals.destroy_all}"
    logger.info "deleting referral_batches: #{self.referral_batches.destroy_all}"
    logger.info "deleting products: #{self.products.destroy_all}"
    logger.info "deleting customizations: #{self.customizations.destroy_all}"
  end
  def self.E3
    find_by_key "e3innovate"
  end

  def self.NL
    find_by_key "newliving"
  end

  def self.sunpro
    find_by_key "sunpro"
  end

  validates_uniqueness_of :key
end
