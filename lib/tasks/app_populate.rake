namespace :weave do
  desc 'Fill dev database with test data'

  task :populateForce => [:environment, "db:reset"] do
    require 'factory_girl'
    require 'spec/factories.rb'
   
    p "Manifacturing Objects..."
    FactoryGirl.create :referral_batch
    # (1..2).each  { Factory(:organization) }
  end
  task :populate => :environment do 
    require 'factory_girl'
    # require 'spec/factories.rb'
    # require Rails.root.join("spec", "factories.rb")

    binding.pry
    p "Manifacturing Objects..."
    FactoryGirl.create :referral_batch
  end
end
