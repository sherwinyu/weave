class ApplicationController < ActionController::Base
  protect_from_forgery
  private
  def current_user
    @current_user ||= session[:user_id] # nil # User.find(session[:user_id]) if session[:user_id]
  end

  helper_method :current_user

  def fb_api oauth_token=nil
    oauth_token ||= session[:fb_user][:oauth_token]
    @facebook_api ||= Koala::Facebook::GraphAPI.new oauth_token
  end
  
end
