require 'spec_helper'

describe OmniauthCallbacksController do

  before :each do
    @request.env["devise.mapping"] = Devise.mappings[:user]
  end

  describe "#oauthorize" do
    before :each do
      request.env['omniauth.auth'] = OmniAuth::AuthHash.new credentials: {token: "walawala" }
    end

    context "on authorization with existing user when not signed in" do
      before :each do
        @auth = create(:authorization)
        @user = @auth.user

        request.env['omniauth.auth'].merge! provider: @auth.provider, uid: @auth.uid,
          info:
            { first_name: @user.name.split.first,
              last_name: @user.name.split.last,
              email: @user.email,
              extra: {}
            }

        get :oauthorize
      end

      it "signs in the correct user" do
        subject.current_user.should eq @user
      end
      it "redirects to root" do
        raw_json = response.body
        json = JSON.parse raw_json
        raw_json.should eq controller.json_for @user
        json.should have_key "user"
      end
      it "sets a notice " do
        flash[:notice].should =~ /signed in through facebook/i
      end
    end


    context "on new (user-less) authorization when not signed in" do
      before :each do
        @auth_attributes = attributes_for :authorization
        @user_attrs = attributes_for :user
        request.env['omniauth.auth'].merge! @auth_attributes.slice(:provider, :uid)
        request.env['omniauth.auth'].merge!(
             info:
              { first_name: @user_attrs[:name].split.first,
                last_name: @user_attrs[:name].split.last,
                email: @user_attrs[:email],
                extra: {} }
            )
        get :oauthorize
      end
      it "creates the new user and authorization" do
        subject.current_user.should eq User.last
        subject.current_user.should be_persisted
        subject.current_user.authorizations.count.should be 1
        subject.current_user.authorizations.first.should be_persisted
        subject.current_user.authorizations.first.provider.should eq @auth_attributes[:provider]
        subject.current_user.authorizations.first.uid.should eq @auth_attributes[:uid]
      end
      it "sets a notice" do
        flash[:notice].should =~ /signed in through facebook/i
      end
      it "returns the proper json" do
        raw_json = response.body
        json = JSON.parse raw_json
        raw_json.should eq controller.json_for subject.current_user
        json.should have_key "user"
        json['user'].should have_key 'email'
        json['user']['email'].should eq @user_attrs[:email]
      end
    end

    context "when signed in" do
      before :each do
        @user = create(:user)
        sign_in @user
      end

      context "on new authorization" do
        before :each do
          @auth_attributes = attributes_for :authorization
          request.env['omniauth.auth'].merge! @auth_attributes.slice :provider, :uid
          request.env['omniauth.auth'].merge!(
          info:
            { first_name: @user.name.split.first,
              last_name: @user.name.split.last,
              email: @user.email,
              extra: {}
            }
          )
          get :oauthorize
        end
        it "attachs authorization to current user" do
          auth = @user.authorizations.find_by_provider_and_uid(@auth_attributes[:provider], @auth_attributes[:uid])
          auth.should_not be_nil
          auth.should be_persisted
        end
        it "sets the notice" do
          flash[:notice].should =~ /associating with new account/i
        end
        it "keeps the user signed in" do
          subject.current_user.should eq @user
        end
      end

      context "on existing authorization" do
        before :each do
          @auth = create(:authorization)
          @user = @auth.user
          request.env['omniauth.auth'].merge! @auth.attributes.with_indifferent_access.slice :provider, :uid
          sign_in @user
        end
        it "sets the notice" do
          get :oauthorize
          flash.notice.should =~ /already associated/i
        end
        it "returns the proper json" do
          get :oauthorize
          raw_json = response.body
          json = JSON.parse raw_json
          raw_json.should eq controller.json_for subject.current_user
          json.should have_key "user"
          json['user'].should have_key 'email'
          json['user']['email'].should eq @user[:email]
        end
        it "keeps the user signed in" do
          get :oauthorize
          subject.current_user.should eq @user
        end
        context "already associated with another user" do
          before :each do
            @other_user = create :user
            sign_in @other_user
          end
          it "raises an error" do
            expect {get :oauthorize}.to raise_error /authorization attached to another user/
          end
        end
      end
    end
  end
end
