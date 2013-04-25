require File.dirname(__FILE__) + '/../spec_helper'

describe Incentive do
  it "should be valid" do
    Incentive.new.should be_valid
  end
end
