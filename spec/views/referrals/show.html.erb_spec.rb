require 'spec_helper'

describe "referrals/show.html.erb" do
  before(:each) do
    @referral = assign(:referral, stub_model(Referral,
      :content => "Content"
    ))
  end

  it "renders attributes in <p>" do
    render
    # Run the generator again with the --webrat-matchers flag if you want to use webrat matchers
    rendered.should match(/Content/)
  end
end
