require 'spec_helper'

describe User do
  # pending "add some examples to (or delete) #{__FILE__}"
  describe "self.find_or_initialize_from_omniauth" do
    before :each do
      @auth_hash = {otherstuff: "derp"}
    end
    it "should return an existing user if the authorization exists" do
      auth = FactoryGirl.create :authorization
      user = User.find_or_initialize_from_omniauth(
        @auth_hash.merge provider: auth.provider, uid: auth.uid
      )
      user.should eq auth.user
      user.should_not be_new_record
    end
    it "should build a new user with the passed auth details if user doest not exist " do
      user = User.find_or_initialize_from_omniauth( @auth_hash.merge provider: 'facebook', uid: "facebookid")
      user.should be_new_record
      user.authorizations.find_by_provider_and_uid 'facebook', 'facebookid'
    end
  end

end
