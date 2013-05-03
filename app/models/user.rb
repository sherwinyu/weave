class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable,
  # :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable,
         # :registerable,
         :recoverable, :rememberable, :trackable, :validatable, :omniauthable

  # Setup accessible (or protected) attributes for your model
  attr_accessible :name, :email, :password, :password_confirmation, :remember_me, :user_infos_attributes, :user_infos
  has_many :sent_referrals, class_name: "Referral", inverse_of: :sender
  has_many :referral_batches, inverse_of: :sender
  has_many :received_referrals, class_name: "Referral", inverse_of: :recipient
  has_many :user_infos, inverse_of: :user
  has_many :authorizations, inverse_of: :user

  accepts_nested_attributes_for :user_infos

  def email_required?
    false #TODO(syu): fix
  end
  def password_required?
    false #TODO(syu): fix
  end


  # Takes an omniauth.auth hash (with provider, uid set)
  # searches for a user that has the provider and uid in auth hash
  # if such a user exists, return it
  # otherwise, build a user with the authorization set and return that
  def self.find_or_initialize_from_omniauth  auth_hash
    auth = Authorization.find_or_initialize_from_omniauth auth_hash

    #user = includes(:authorizations).merge(
      #Authorization.where(auth_hash.slice :provider, :uid)).first
    if auth.persisted?
      raise "Expected authorization#{auth} to have an user" unless auth.user
      auth.user
    else
      user = User.new # TODO(syu): handle creation of user infos?
      user.authorizations << auth
      auth.user = user
      user
    end
  end

  def visit!
    self.visited_at = Time.now
  end
  def visited?
    !!visited_at
  end

end
