class ClientSerializer < ActiveModel::Serializer
  attributes :id, :name
  embed :ids, include: false
  has_many :products
end
