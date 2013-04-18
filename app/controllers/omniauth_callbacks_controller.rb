class OmniauthCallbacksController < Devise::OmniauthCallbacksController
  def all
    raise request.env['omniauth.auth'].to_yaml
    User.from_omniauth request.env['omniauth.auth']
  end
  alias_method :facebook, :all
end
