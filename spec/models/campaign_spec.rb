require File.dirname(__FILE__) + '/../spec_helper'

describe Campaign do
  it "should be valid" do
    Campaign.new.should be_valid
  end
  describe "Campaign.mailchimp" do
    let(:mail_chimp_proxy) { double "mail_chimp_proxy" }
    let (:api_key) {"31415abcd"}
    before :each do
      Campaign::MailChimpProxy.stub(:new).and_return mail_chimp_proxy
      Gibbon.stub(:new).and_call_original
    end
    it "creates a new Gibbon instance with the api_key" do
      Figaro.stub(env: Figaro::Env.from("MAILCHIMP_CLIENT_API_KEY" => api_key))
      ret = Campaign.mailchimp
      expect(Gibbon).to have_received(:new).with api_key
      Gibbon.should have_received(:new).with api_key
    end
    it "memoizes the return call" do
      Figaro.stub(env: Figaro::Env.from("MAILCHIMP_CLIENT_API_KEY" => api_key))
      ret1 = Campaign.mailchimp
      ret2 = Campaign.mailchimp
      ret1.should be ret2
    end
  end
end

describe Campaign::MailChimpProxy do
  let(:mail_chimp_proxy) { Campaign::MailChimpProxy.new @gibbon}
  before :each do
    @gibbon = double "gibbon"
    @args = {id: 55, data: [1,2,3,4]}
  end
  it "forwards missing method calls to the gibbon object" do
    @gibbon.stub :wagawaga
    mail_chimp_proxy.wagawaga(@args)
    @gibbon.should have_received(:wagawaga).with(@args)
  end
  describe "method response" do
    it "wraps the repsonse in a Hashie::Mash" do
      @response = {total: 5, data: [3,1,4,1,5]}
      @args = {id: 55, data: [1,2,3,4]}
      @gibbon.stub(:generic_api_call).and_return @response

      Hashie::Mash.stub(:new).and_call_original
      result = mail_chimp_proxy.generic_api_call @args

      Hashie::Mash.should have_received(:new).with @response
      result.should be_an_instance_of Hashie::Mash
      result.total.should be 5
    end
    context 'when api method is on the exclude list (because it doesnt return a hash' do
      it "does not wrap the response in a hashie::Mash" do
        @response = "123"

        method = mail_chimp_proxy.exclude_list.first
        @args = {id: 55, data: [1,2,3,4]}
        @gibbon.stub(method).and_return @response

        Hashie::Mash.stub(:new).and_call_original
        result = mail_chimp_proxy.send method, @args

        Hashie::Mash.should_not have_received(:new)
        result.should_not be_an_instance_of Hashie::Mash
        result.should be @response
      end
    end

  end
end
