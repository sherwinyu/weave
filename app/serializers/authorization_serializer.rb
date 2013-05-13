class AuthorizationSerializer < ActiveModel::Serializer
  attributes :uid, :provider
end
