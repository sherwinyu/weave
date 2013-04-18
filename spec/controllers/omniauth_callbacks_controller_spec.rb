require 'spec_helper'

describe OmniauthCallbacksController do
  describe "#oauthorize" do
    context " on existing authoriation when not signed in" do
      before :each do
        @auth = create(:authorization)
        @user = @auth.user
        request.env['omniauth.auth'] = {
          provider: @auth.provider,
          uid: @auth.uid
        }
      end

      it "finds the user" do
        get :oauthorize
        assigns(@user).should eq @user
      end
      it "signs him in" do

      end
      it "redirects to root" do

      end
    end
  end

end
