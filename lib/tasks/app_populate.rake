namespace :weave do
  desc 'Fill dev database with test data'

  task :resetAndPopulate => [:environment, "db:reset"] do
    require 'factory_girl'

    p "Manifacturing Objects..."
    FactoryGirl.create :referral_batch
    # (1..2).each  { Factory(:organization) }
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
