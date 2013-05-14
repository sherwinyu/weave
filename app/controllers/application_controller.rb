class ApplicationController < ActionController::Base
  protect_from_forgery
=begin
  def current_user
    @current_user ||= session[:user_id] # nil # User.find(session[:user_id]) if session[:user_id]
  end
=end

  def json_for (target, options={})
    options[:scope] ||= self
    options[:url_options] ||= url_options
    target.active_model_serializer.new(target, options).to_json
  end

  helper_method :current_user

  def fb_api oauth_token=nil
    oauth_token ||= session[:fb_user][:oauth_token] if session[:fb_user]
    @facebook_api ||= Koala::Facebook::GraphAPI.new oauth_token
  end

  def fb_oauth
    @facebook_oauth ||= Koala::Facebook::OAuth.new(Figaro.env.FACEBOOK_APP_ID, Figaro.env.FACEBOOK_SECRET)
  end

  def other_token
    fb_oauth.get_user_info_from_cookies cookies
  end
  before_filter :inject_ember_params

  def inject_ember_params
    @rails = {
      pathHelpers: {
        userOmniauthCallbackPathFacebook: user_omniauth_callback_path(:facebook)
      },
      path: request.path,
      env: Figaro.env
    }
  end


end
