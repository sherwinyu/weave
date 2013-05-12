require 'spec_helper'

describe "Referrals" do
  describe "create new referral with recipient" do
    before(:each) do
      create :referral_batch
    end
    it "works", js: true do
      visit  '#/stories/1/referrals/select_recipient'

      fill_in "wala", with: "y z"
      ex "$('#wala').keydown()"

      find("a", text: "Yan Zhang").click
      page.should have_content "customizations"
      uri = URI.parse(current_url)
      uri.fragment.split("/").last.should eq "edit_body"
    end
  end
  describe "update existing referral with body + customizations" do
    before(:each) do
      @referral = create :referral
    end
    it "works" do
      visit "#/stories/#{@referral.referral_batch.id}/referrals/#{@referral.id}/edit_body"
      fill_in "referral-content", with: "I really think you should buy this product! It's totally awesome"
      fill_in "referral-recipient-email", with: "sherwin@communificiency.com"
      find("#referral-send").click
      page.should have_content "Your referral was sent!"
    end
  end
end
