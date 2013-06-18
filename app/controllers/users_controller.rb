class UsersController < Devise::RegistrationsController
  def create
    @u = User.new params[:user].slice(:name, :email)
    render json: nil, status: 204
  end
  def update_email
    @user = User.find params[:id]
    @user.email = params[:user][:canonical_email]
    @user.email_provided = true
    @user.save
    render json: @user
  end
end
