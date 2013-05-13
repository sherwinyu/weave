class OmniauthCallbacksController < Devise::OmniauthCallbacksController
  def oauthorize
    @auth = Authorization.find_or_initialize_from_omniauth request.env['omniauth.auth']
    if user_signed_in?
      @user = current_user
      if @auth.new_record?
        @user.authorizations << @auth
        flash.notice = "Associating with new account"
      else
        raise "current user shouldn't be authorizing with an authorization attached to another user" if @auth.user != current_user
        flash.notice = "You're already associated with that account"
      end
      @user.save
    else # when no current user
      @user = User.find_or_initialize_from_omniauth request.env['omniauth.auth']
      @user.save validate: false
      if @user.persisted? #
        sign_in @user
        flash.notice = "Welcome, #{@user.name}. You've signed in through Facebook"
      else
        flash.alert = "An error occured"
      end
    end
    render json: @user

  end
  alias_method :facebook, :oauthorize
end
