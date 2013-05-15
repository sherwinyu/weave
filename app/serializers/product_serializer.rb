class ProductSerializer < ActiveModel::Serializer
  embed :ids
  attributes :id, :name, :description
  has_many :customizations, include: true
  has_many :campaigns
end
