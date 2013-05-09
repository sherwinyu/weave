class UserInfo < ActiveRecord::Base
  attr_accessible :name, :email, :user_id, :uid, :provider, :other_info, :email
  belongs_to :user, inverse_of: :user_infos
end
