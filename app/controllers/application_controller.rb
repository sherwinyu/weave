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

  # before_filter :redirect_always
  def redirect_always
    if request.url =~ /friends\.weaveenergy/
      redirect_to "#{request.protocol}www.weaveenergy.com/friends"
    end

    if request.url =~ /staging\.weaveenergy/
      redirect_to "#{request.protocol}www.weaveenergy.com/friends"
    end
  end

  before_filter :inject_ember_params
  def inject_ember_params
    @rails = {
      pathHelpers: {
        userOmniauthCallbackPathFacebook: user_omniauth_callback_path(:facebook),
        destroyUserSessionPath: destroy_user_session_path
      },
      path: request.path || "products/selectProduct",
      current_user: current_user && current_user.active_model_serializer.new(current_user).to_json,
      env: {
        FACEBOOK_APP_ID: Figaro.env.FACEBOOK_APP_ID
      },
      landing_email: params[:landing_email],
      campaign_id: params[:campaign_id] || 1
    }
  end

  # TODO(syu): TEST this. Also, this doesn't work with doubly nested hashes! -- Post -> post.comments_attributes -> post.comments_attributes.0.author_attriibutes
  before_filter :normalize_params
  def normalize_params
    params.select {|k| k.singularize.classify.constantize < ActiveRecord::Base rescue nil}.each do |model_name, model_params|
      assocs = model_name.singularize.classify.constantize.reflections
      assocs.each do |association_key, association|
        association_params = model_params.delete association_key
        if association_params
          # attributes_key = "_attributes" + ( [:belongs_to, :has_one].include? association.macro ? "" : "s")
          model_params[association_key.to_s + "_attributes"] = association_params
        end
      end
    end
  end

end
