class CustomizationSerializer < ActiveModel::Serializer
  embed :ids, include: true
  attributes :id, :content
  # has_one :product
end
