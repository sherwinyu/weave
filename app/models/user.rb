class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable,
  # :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable, :omniauthable

  # Setup accessible (or protected) attributes for your model
  attr_accessible :name, :email, :password, :password_confirmation, :remember_me
  has_many :sent_referrals, class_name: "Referral", inverse_of: :sender
  has_many :referral_batches, inverse_of: :sender
  has_many :received_referrals, class_name: "Referral", inverse_of: :recipient
  has_many :user_infos, inverse_of: :user
  has_many :authorizations, inverse_of: :user


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
      user
    end
  end
=begin

    includes(:authorizations).where(auth_hash.slice(:provider, :uid)).first_or_create do |user|
      user.provider = auth_hash.provider
      user.uid = auth_hash.uid
      # user.username = auth_hash.info.nickname
    end

    @user = User.includes(:authentications).merge(
      authentication.where(auth_hash.slice :provider, :uid)).first
    if @user # if user has this authentication
      if current_user # if user is signed in, then associate the new authorization with the user
        auth = current_user.authorizations.find_or_create_by_provider_and_uid auth_hash[:provider], auth_hash[:uid]
        redirect_to edit_user_registration_url
          # auth.update_attributes auth_hash.slice :provider, :uid
        # end
      else  # no user signed in, so just return the user with this auth
        sign_in_and_redirect @user
      end
    else # create a new user
      user = User.new # TODO(syu): handle creation of user infos?
      user.authentications.build auth_hash.slice :provider, :uid
      user.save
    end
  end
=end

=begin
Cases:
User is signed in
  current_user has this authorization before
  current_user does not have this authorization before
    authorization exists
    authorization dne
User is not signed in
  authorization exists
  authorization dne


def set_token_from_hash(auth_hash, user_hash)
    self.update_attribute(:name, user_hash[:name]) if self.name.blank?
    self.update_attribute(:email, user_hash[:email]) if self.email.blank?
    token = self.authentications.find_or_initialize_by_provider_and_uid(auth_hash[:provider], auth_hash[:uid])
    token.update_attributes(
      :name => auth_hash[:name],
      :link => auth_hash[:link],
      :token => auth_hash[:token],
      :secret => auth_hash[:secret]
    )
  end


    if @user #user exists




  end
  @user = User.includes(:authentications).merge(Authentication.where(:provider => omniauth['provider'], :uid => omniauth['uid'])).first

    if @user # if user exists and has used this authentication before, update details and sign in
      @user.set_token_from_hash(provider_auth_hash(kind, omniauth), provider_user_hash(kind, omniauth))
      sign_in_and_redirect @user, :event => :authentication
    elsif current_user # if user exists then new authentication is being added - so update details and redirect to
      current_user.set_token_from_hash(provider_auth_hash(kind, omniauth), provider_user_hash(kind, omniauth))
      redirect_to edit_user_registration_url
    else # create new user and new authentication
      user = User.new
      user.password = Devise.friendly_token[0,20]
      user.authentications.build(provider_auth_hash(kind, omniauth))
      if user.save :validate => false # validate false handles cases where email not provided - such as Twitter
        sign_in_and_redirect(:user, user)
      else # validate false above makes it almost impossible to get here
        session["devise.#{kind.downcase}_data"] = provider_auth_hash(kind,omniauth).merge(provider_user_hash(kind,omniauth))
        redirect_to new_user_registration_url
      end
=end
end
