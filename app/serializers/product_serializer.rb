class ProductSerializer < ActiveModel::Serializer
  embed :ids, include: true
  attributes :id, :name, :description
  has_many :customizations
  # has_many :campaigns
end
