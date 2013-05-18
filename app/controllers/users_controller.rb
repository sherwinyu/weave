class UsersController < Devise::RegistrationsController
  def create
    render json: nil
  end
  def update_email
    @user = User.find params[:id]
    @user.email = params[:user][:canonical_email]
    @user.email_provided = true
    @user.save
    render json: @user
  end
end
