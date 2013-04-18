class ApplicationController < ActionController::Base
  protect_from_forgery
  private
=begin
  def current_user
    @current_user ||= session[:user_id] # nil # User.find(session[:user_id]) if session[:user_id]
  end
=end

  helper_method :current_user

  def fb_api oauth_token=nil
    oauth_token ||= session[:fb_user][:oauth_token] if session[:fb_user]
    @facebook_api ||= Koala::Facebook::GraphAPI.new oauth_token
  end
  
end
