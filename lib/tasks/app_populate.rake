namespace :weave do
  desc 'Fill dev database with test data'

  task :resetAndPopulate => [:environment, "db:reset"] do
    require 'factory_girl'

    p "Manifacturing Objects..."
    FactoryGirl.create :referral_batch
    camp = Campaign.create name: "non incentives", description: "testing whether people will refer based on good will", outreach_email_content: "", sender_page_content: "", recipient_page_content: ""
    product = Product.create name: "Nest thermostat", description: "thermostat up yo ass"
    custos = %w[wala zug mug].map{|w| Customization.create description: w}
    product.customizations = custos
    campaign.product = product
    campaign.save


  end
  task :herokuPopulate => [:environment] do
    p "Manifacturing Objects..."
    camp = Campaign.create name: "non incentives", description: "testing whether people will refer based on good will", outreach_email_content: "", sender_page_content: "", recipient_page_content: ""
    product = Product.create name: "Nest thermostat", description: "thermostat up yo ass"
    custos = %w[wala zug mug].map{|w| Customization.create description: w}
    product.customizations = custos
    camp.product = product
    camp.save
  end

  task :populate => :environment do
    require 'factory_girl'
    # require 'spec/factories.rb'
    # require Rails.root.join("spec", "factories.rb")

    p "Manifacturing Objects..."
    FactoryGirl.create :referral_batch
    # FactoryGirl.create :campaign
  end
end
