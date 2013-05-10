require 'spec_helper'

describe "Referrals" do
  describe "create new referral with recipient" do
    before(:each) do
      create :referral_batch
    end
    it "works", js: true do
      visit  '#/stories/1/referrals/1'

      fill_in "wala", with: "y z"
      ex "$('#wala').keydown()"

      find("a", text: "Yan Zhang").click
      uri = URI.parse(current_url)
      uri.fragment.split("/").last.should eq "edit_body"
    end
  end
end
