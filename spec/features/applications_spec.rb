require 'spec_helper'

describe "Application" do
  let(:url) {'/'}
  describe "injects correct parameters to the client side application:" do
    let(:url) {super()}
    before :each do
      visit url
    end
    describe "including online out reach params: " do
      let (:url) {super() + '/?landing_email=waga@gmail.com&campaign_id=314one5'}
      it "embeds landing_email", js: true do
        ev("Weave.rails.vars.landing_email").should eq "waga@gmail.com"
      end
      it "embeds campaign_id", js: true do
        ev("Weave.rails.vars.campaign_id").should eq "314one5"
      end
    end
  end
  pending "create new referral with recipient" do
    before(:each) do
      create :referral_batch
    end
    it "works", js: true do
      visit  '#/stories/1/referrals/select_recipient'

      fill_in "wala", with: "y z"
      ex "$('#wala').keydown()"
      page.should_not have_content "Personalize your referral"

      find("a", text: "Yan Zhang").click
      page.should have_content "Personalize your referral"
      uri = URI.parse(current_url)
      uri.fragment.split("/").last.should eq "edit_body"
    end
  end
  pending "update existing referral with body + customizations" do
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
