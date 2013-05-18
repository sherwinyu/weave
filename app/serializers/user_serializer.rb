class UserSerializer < ActiveModel::Serializer
  attributes :id, :name, :email, :canonical_name, :canonical_email, :email_provided
  has_many :authorizations, embed: :objects
end
