require File.dirname(__FILE__) + '/../spec_helper'

describe IncentiveInstance do
  it "should be valid" do
    IncentiveInstance.new.should be_valid
  end
end
