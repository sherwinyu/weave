require 'spec_helper'

describe "Application" do
  let(:url) {'/'}
  describe "injects correct parameters to the client side application:" do
    let(:url) {super()}

    let(:client_sunpro) {create :client, :sunpro}
    let(:client_newliving) {create :client, :newliving}

    let(:host) {"test-sunpro.weaveenergy.com"}
    let(:client) { client_sunpro }
    let(:campaign) {client.campaigns.first}

    before :each do
      client_sunpro
      client_newliving
      ApplicationController.any_instance.stub(:get_host).and_return host
      visit url
    end

    describe "including online out reach params: " do
      let (:url) {super() + "/?landing_email=waga@gmail.com&campaign_id=#{campaign.id}"}
      it "embeds landing_email", js: true do
        ev("Weave.rails.vars.landing_email").should eq "waga@gmail.com"
      end
      it "embeds campaign_id", js: true do
        ev("Weave.rails.vars.campaign_id").to_s.should eq "#{campaign.id}"
      end
    end
    describe "visiting a different path: " do
      it 'redirects to the corret ember.js route'
    end


    describe "test-sunpro.weaveenergy.com" do
      let(:host) {"test-sunpro.weaveenergy.com"}
      describe "embedded params" do
        it "embeds the default campaign_id", js: true do
          ev("Weave.rails.vars.campaign_id").should eq client_sunpro.campaigns.first.id
        end
      end
    end

    describe "staging.weaveenergy.com" do
      let(:host) {"staging.weaveenergy.com"}
      describe "embedded params" do
        it "embeds the default campaign_id", js: true do
          ev("Weave.rails.vars.campaign_id").should eq client_sunpro.campaigns.first.id
        end
      end

    end
  end

end
