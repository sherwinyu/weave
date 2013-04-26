class Authorization < ActiveRecord::Base
  attr_accessible :oauth_token, :provider, :uid, :user_id
  belongs_to :user, inverse_of: :authorizations

  def self.find_or_initialize_from_omniauth auth_hash
    auth_hash = auth_hash.with_indifferent_access
    auth = find_or_initialize_by_provider_and_uid auth_hash[:provider], auth_hash[:uid]
    auth.oauth_token = auth_hash["credentials"]["token"]
    auth
  end
end
