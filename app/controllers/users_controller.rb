class UsersController < Devise::RegistrationsController
  def update_email
    @user = User.find params[:id]
    @user.email = params[:user][:canonical_email]
    @user.email_provided = true
    @user.save
    render json: @user
  end

  def create
    @u = User.new params[:user].slice(:name, :email)
    @user = User.new
    case meta_action
    when "create_sender"
      create_sender
    else
    end

    @user.attributes = @attributes
    if @valid && @user.save(validate: false)
      render json: @user
    else
      logger.debug "validation error: #{@user.try(:errors).to_a}"
      render json: @user, status: 422
    end

  end

  def create_sender
    @attributes = user_params.slice(:name, :email)
    @valid = true
  end

  def meta_params
    @meta ||= (params[:user].delete(:meta) || {} )
  end

  def meta_action
    meta_params[:action]
  end

  def user_params
    meta_params
    params.require(:user).permit :name, :email
  end
end
