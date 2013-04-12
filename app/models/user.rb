class User < ActiveRecord::Base
  attr_accessible :email, :name
  has_many :sent_referrals, class_name: "Referral", inverse_of: :sender
  has_many :received_referrals, class_name: "Referral", inverse_of: :recipient
  has_many :user_infos, inverse_of: :user
  has_many :authorizations, inverse_of: :user
end
