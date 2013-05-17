class RegistrationsController < Devise::RegistrationsController
  def create
    render json: nil
  end
  def update
    render json: nil
  end
end
