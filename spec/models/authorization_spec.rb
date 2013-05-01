require 'spec_helper'

describe Authorization do
  describe "self.find_or_initialize_from_omniauth" do
    before :each do
      @omniauth_hash =  {otherstuff: 'wala', credentials: {token: "01234567890"}}
    end

    it "finds an authorization with the matching provider and uid" do
      @auth = create :authorization
      @omniauth_hash.merge! @auth.attributes.with_indifferent_access.slice "provider", "uid"
      found_auth = Authorization.find_or_initialize_from_omniauth @omniauth_hash
      found_auth.should eq @auth
      found_auth.should be_persisted
    end
    it "inits an authorization when no matching authorization can be found" do
      @auth_attributes = attributes_for :authorization
      @omniauth_hash.merge! @auth_attributes.slice "provider", "uid"
      found_auth = Authorization.find_or_initialize_from_omniauth @omniauth_hash
      found_auth.should be_new_record
      found_auth.provider.should eq @auth_attributes["provider"]
      found_auth.uid.should eq @auth_attributes["uid"]
    end
    it "set the oauth_token from the auth_hash on a new authorization" do 
      @auth_attributes = attributes_for :authorization
      @omniauth_hash.merge! @auth_attributes.slice "provider", "uid"
      found_auth = Authorization.find_or_initialize_from_omniauth @omniauth_hash
      found_auth.oauth_token.should eq "01234567890"
    end
    it "sets the oauth_token from the auth_hash on an existnig authorization" do
      @auth = create :authorization
      @omniauth_hash.merge! @auth.attributes.with_indifferent_access.slice "provider", "uid"
      found_auth = Authorization.find_or_initialize_from_omniauth @omniauth_hash
      found_auth.oauth_token.should eq "01234567890"
    end

  end

end
