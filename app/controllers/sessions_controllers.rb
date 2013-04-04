class SessionsController < ApplicationController
  def new 
  end
  def create
    user = User.from_omniauth(env["omniauth.auth"])
    session[:user_id] = env["omniauth.auth"][:uid]
    redirect_to root_url
  end
end
