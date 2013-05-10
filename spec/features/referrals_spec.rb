require 'spec_helper'

describe "zugReferrals" do
  describe "stuff" do
    pending "works", js: true do
      click '#sign-in-facebook'
      complete_facebook_connect_and_wait_for "Weave"
      visit  '#/stories/1/referrals/1'
    end
  end
end
