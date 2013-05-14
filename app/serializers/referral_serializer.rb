class ReferralSerializer < ActiveModel::Serializer
  embed :ids
  attributes :id, :message
  has_one :referral_batch
  has_one :sender
  has_one :recipient, embed: :objects
  has_many :customizations
  has_many :incentives
end
