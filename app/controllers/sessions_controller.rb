class SessionsController < ApplicationController
  def create
    # user = User.from_omniauth(env["omniauth.auth"])
    omni = env["omniauth.auth"]
    session[:user_id] = omni[:uid]
    session[:fb_user] = {}
    session[:fb_user][:name] = omni.info.name
    session[:fb_user][:oauth_token] = omni.credentials.token
    session[:fb_user][:oauth_token_expires_at] = Time.at omni.credentials.expires_at
    # session[:omniauth] = env["omniauth.auth"]

    redirect_to "/"
  end

  def destroy
    session[:user_id] = nil
    session.delete :fb_user
    redirect_to root_url
  end

end
