class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable,
  # :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  # Setup accessible (or protected) attributes for your model
  attr_accessible :email, :password, :password_confirmation, :remember_me
  attr_accessible :email, :name
  has_many :sent_referrals, class_name: "Referral", inverse_of: :sender
  has_many :received_referrals, class_name: "Referral", inverse_of: :recipient
  has_many :user_infos, inverse_of: :user
  has_many :authorizations, inverse_of: :user
end
