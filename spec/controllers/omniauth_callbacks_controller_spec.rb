require 'spec_helper'

describe OmniauthCallbacksController do

  before :each do
    @request.env["devise.mapping"] = Devise.mappings[:user]
  end

  describe "#oauthorize" do
    context " on existing authorization when not signed in" do
      before :each do
        @auth = create(:authorization)
        @user = @auth.user

        request.env['omniauth.auth'] = {
          provider: @auth.provider,
          uid: @auth.uid
        }
      end

      it "finds the user" do
        # assigns(@user).should eq @user
        get :oauthorize
        subject.current_user.should eq @user
      end
      it "signs him in" do
        get :oauthorize
        subject.current_user.should eq @user
      end
      it "redirects to root" do
        # TODO fix me
        response.should redirect_to @user
      end
    end
  end

end
