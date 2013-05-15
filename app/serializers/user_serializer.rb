class UserSerializer < ActiveModel::Serializer
  attributes :id, :name, :email, :canonical_email
  has_many :authorizations, embed: :objects
end
