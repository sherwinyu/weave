require 'spec_helper'

describe "Referrals" do
  describe "create new referral with recipient" do
    it "works", js: true do
      visit  '#/stories/1/referrals/1'
      binding.pry
      fill_in ".recipient-name-or-email", with: "y z"
    end
  end
end
