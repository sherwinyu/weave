# == Schema Information
#
# Table name: users
#
#  id                     :integer          not null, primary key
#  name                   :string(255)
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  encrypted_password     :string(255)      default(""), not null
#  reset_password_token   :string(255)
#  reset_password_sent_at :datetime
#  remember_created_at    :datetime
#  sign_in_count          :integer          default(0)
#  current_sign_in_at     :datetime
#  last_sign_in_at        :datetime
#  current_sign_in_ip     :string(255)
#  last_sign_in_ip        :string(255)
#  materialized           :boolean          default(FALSE)
#  email_provided         :boolean
#  omniauthed             :boolean
#  visited_at             :datetime
#  email                  :string(255)
#

class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable,
  # :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable,
         :registerable,
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

  def emailable?
    !!(email && email =~/\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i)
  end

  def add_user_info_from_omniauth omniauth
    if omniauth.provider == "facebook"
      self.user_infos.create(
        uid: omniauth.uid,
        name: omniauth.info.name,
        first_name: omniauth.info.first_name,
        last_name: omniauth.info.last_name,
        email: omniauth.info.email,
        location: omniauth.info.email,
        other_info: omniauth.extra.to_json,
      )
    end
  end

  # alias_method :original_email, :email
  # def email
    # self.original_email || email_from_infos
  # end
  def email_from_infos
    user_infos.map(&:email).try(:first)
  end
end
