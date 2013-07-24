class ClientSerializer < ActiveModel::Serializer
  attributes :id, :name, :referral_message, :intro_message
  embed :ids, include: false
  has_many :products
end
