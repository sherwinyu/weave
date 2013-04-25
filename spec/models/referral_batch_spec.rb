require File.dirname(__FILE__) + '/../spec_helper'

describe ReferralBatch do
  it "should be valid" do
    ReferralBatch.new.should be_valid
  end
end
