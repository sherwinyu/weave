class CustomizationSerializer < ActiveModel::Serializer
  embed :ids, include: true
  attributes :id, :description
  # has_one :product
end
