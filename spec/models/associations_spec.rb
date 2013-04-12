require 'spec_helper'

describe "Associations" do
  it "should work" do
    u = User.new
    u.sent_referrals
    u.received_referrals
    u.authorizations
    u.user_infos

    r = Referral.new
    r.sender
    r.recipient
    r.recipient_info
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
    ui.received_referral

    a = Authorization.new
    a.user

    s = Segment.new
    s.products
    s.customizations
  end
end
