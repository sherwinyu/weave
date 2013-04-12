class Authorization < ActiveRecord::Base
  attr_accessible :oauth_token, :provider, :uid, :user_id
  belongs_to :user, inverse_of: :authorizations
end
