class ReferralSerializer < ActiveModel::Serializer
  embed :ids
  attributes :id, :message
  has_one :referral_batch
  has_one :sender
  has_one :recipient
  has_many :customizations
  has_many :incentives
end
