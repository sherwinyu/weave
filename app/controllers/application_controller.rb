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
    @rails = Hashie::Mash.new({
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
      campaign_id: compute_campaign_id,
      client: compute_client,
    })
  end

  # Return the campaign_id to be embedded in the @rails payload to the ember app
  #  * If no campaign_id param is specified, fallback to the client's default campaign_id
  #  * If the specified campaign_id is incompatiblew ith the client_id, fallback to the client's
  # default campaign_id
  #  * If a valid campaign_id param is specified, use that
  def compute_campaign_id
    begin
      if params[:campaign_id].present?
        if client_from_domain.campaign_ids.include? params[:campaign_id]
          params[:campaign_id]

        else
          client_from_domain.try(:campaigns).try(:first).try(:id)
          client_from_domain.campaigns.first.id
        end
      else
        client_from_domain.try(:campaigns).try(:first).try(:id)
        client_from_domain.campaigns.first.id
      end
    rescue
      params[:campaign_id] || 0
    end

  end

  def compute_client
    client_from_domain
  end

  def get_host
    request.host
  end

  def client_from_domain
    host = get_host
    if Rails.env.development?
      host = "development-sunpro.localhost"
    elsif Rails.env.test? && host == "test.host"
      host = "test-sunpro.localhost"
    end
    subdomain = host.partition(".").first
    client_key = if subdomain.starts_with? environment_tag
                    subdomain.partition(environment_tag).last
                  else
                    logger.fatal "Attempted to decode client with unrecognizable subdomain #{host}"
                    raise "invalid subdomain #{host}"
                  end

    client = Client.find_by_key client_key
    client # or (raise "Couldn't find client with key '#{client_key}'")
  end

  def environment_tag
    if Rails.env.production?
      ""
    else
      "#{Rails.env}-"
    end
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
