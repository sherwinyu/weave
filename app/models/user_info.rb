class UserInfo < ActiveRecord::Base
  attr_accessible :email, :user_id
  belongs_to :user, inverse_of: :user_infos
  has_one :received_referral, class_name: "Referral", inverse_of: :recipient_info
end
