class UserInfo < ActiveRecord::Base
  attr_accessible :email, :user_id, :uid, :provider, :other_info
  belongs_to :user, inverse_of: :user_infos
end
