class Authorization < ActiveRecord::Base
  attr_accessible :oauth_token, :provider, :uid, :user_id
end
