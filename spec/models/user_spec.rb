require 'spec_helper'

describe User do
  # pending "add some examples to (or delete) #{__FILE__}"
  describe "self.find_or_initialize_from_omniauth" do
    before :each do
      @auth_hash = {otherstuff: "derp", credentials: {token: "1234567890"} }
    end


    context "existing authorization" do 
      before :each do
        @user = create :user
        @auth = create :authorization, user: @user
        @omniauth_hash = @auth_hash.merge provider: @auth.provider, uid: @auth.uid
        Authorization.stub(:find_or_initialize_from_omniauth).and_return @auth
      end
      it "raises an error if the authorization has no user" do
        @auth.update_attribute :user, nil

        expect { User.find_or_initialize_from_omniauth @omniauth_hash }.to raise_error /Expected authorization.*to have an user/
      end
      it "returns the existing user" do
        found_user = User.find_or_initialize_from_omniauth @omniauth_hash
        found_user.should eq @auth.user
        found_user.should_not be_new_record
      end
    end


    context "new authorization" do
      before :each do
        @omniauth_hash = @auth_hash.merge provider: "facebook",  uid: 'facebookid'
        @new_auth = build :authorization, provider: "facebook", uid: "facebookid"
        Authorization.stub(:find_or_initialize_from_omniauth).and_return @new_auth
      end
      it "returns newly built user that has a new authorization with omniauth details" do
        found_user = User.find_or_initialize_from_omniauth @omniauth_hash
        found_user.should be_new_record
        found_auth = found_user.authorizations.detect {|a| a.provider == @new_auth.provider && a.uid == @new_auth.uid } 
        found_auth.should be_new_record
        found_auth.user.should be found_user
      end
    end
  end

end
