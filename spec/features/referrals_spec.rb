require 'spec_helper'

describe "zugReferrals" do
  describe "stuff" do
    it "works", js: true do
      binding.pry
      visit  '#/stories/1/referrals/1'
      save_and_open_page
    end
  end
end
