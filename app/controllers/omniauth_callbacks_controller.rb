class OmniauthCallbacksController < Devise::OmniauthCallbacksController
  def oauthorize
    @user = User.find_or_initialize_from_omniauth request.env['omniauth.auth']
    sign_in_and_redirect @user
  end
  alias_method :facebook, :oauthorize
end
