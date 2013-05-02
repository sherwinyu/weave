require 'spec_helper'

describe "Associations" do
  it "should work" do
    u = User.new
    u.referral_batches
    u.received_referrals
    u.authorizations
    u.user_infos

    r = Referral.new
    r.sender
    r.recipient
    r.customizations
    r.product

    c = Customization.new
    c.referrals
    c.product
    c.segments

    p = Product.new
    p.customizations
    p.segments
    p.referrals

    ui = UserInfo.new
    ui.user

    a = Authorization.new
    a.user

    s = Segment.new
    s.products
    s.customizations
  end
end
