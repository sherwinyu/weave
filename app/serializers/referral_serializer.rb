class ReferralSerializer < ActiveModel::Serializer
  embed :ids
  attributes :id
  has_one :sender
  has_one :recipient
  has_many :customizations
  has_many :incentives
end
