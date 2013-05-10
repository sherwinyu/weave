# == Schema Information
#
# Table name: authorizations
#
#  id          :integer          not null, primary key
#  uid         :string(255)
#  provider    :string(255)
#  user_id     :integer
#  oauth_token :string(255)
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#

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
