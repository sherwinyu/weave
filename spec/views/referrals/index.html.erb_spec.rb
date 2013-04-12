require 'spec_helper'

describe "referrals/index.html.erb" do
  before(:each) do
    assign(:referrals, [
      stub_model(Referral,
        :content => "Content"
      ),
      stub_model(Referral,
        :content => "Content"
      )
    ])
  end

  it "renders a list of referrals" do
    render
    # Run the generator again with the --webrat-matchers flag if you want to use webrat matchers
    assert_select "tr>td", :text => "Content".to_s, :count => 2
  end
end
