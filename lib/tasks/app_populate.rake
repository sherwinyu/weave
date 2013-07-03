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

  task :populate => :environment do
    require 'factory_girl'
    # require 'spec/factories.rb'
    # require Rails.root.join("spec", "factories.rb")

    p "Manifacturing Objects..."
    FactoryGirl.create :referral_batch
    # FactoryGirl.create :campaign
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








##################################################

  task :populateNewliving => [:environment] do
    p "deleting products: #{Product.delete_all}"
    p "deleting campaigns: #{Campaign.delete_all}"
    p "deleting customizations: #{Customization.delete_all}"
    p "Manufacutinrg New living objects"
### Air Filter::

product = Product.create name: "Premium Air Filtration System"
product.customizations.create description: "According to the EPA, indoor air is about 200% more polluted than outside air."
product.customizations.create description: "Houston has the highest rate of childhood asthma among any major US city."
product.customizations.create description: "With a note from a medical Doctor advising an air filtration system, no sales tax is charged. You can also use a discretionary spending account with your insurance provider to pay for an air filter."
product.customizations.create description: "Compared to the size of their bodies, children take in more air than adults do and are therefore at a higher risk of being affected by polluted air."
product.customizations.create description: "New Living air filters removes benzene, wood smoke, formaldehyde, other VOCs, bacteria, and viruses from the air."
product.customizations.create description: "New Living's Air Filtration machines are great for the nursery as they remove dust, pollen, and harmful gases from the air. They also reduce nighttime asthma, allergies, runny nose, congestion, dry mouth, coughing and wheezing."
# c1 = Campaign.create product: product, name: "#{product.name} sender:no-incentives recipient:noncontingent-plant"


### Water Filter:
product = Product.create name: "Premium Water Filtration System"
product.customizations.create description: "Traditional filters don't cut it. Our body is composed of 70% water, and more water absorbs into our skin when we bathe than when we drink."
product.customizations.create description: "With a note from a medical Doctor advising a water filtration system, no sales tax is charged. You can also use a discretionary spending account with your insurance provider to pay for your filter."
product.customizations.create description: "Houston's water supply contains high concentrations of 18 contaminants ranging from arsenic to chlorine, making it the 6th most contaminated water in the country (EWG Study)"
product.customizations.create description: "You will not have to purchase bottled water again once you have a whole home filtration system."
# c2 = Campaign.create product: product, name: "#{product.name} sender:no-incentives recipient:noncontingent-plant"


### Green Painter
product = Product.create name: "Green Painter VOC free paint"
product.customizations.create description: "The average lifespan of a painter is only 54 years old according to the World Health Organization. You can help change that by using healthier chemicals in your home improvement project!"
product.customizations.create description: "Painted surfaces, like homes and buildings, give off 25% more toxins per day than gas stations and oil refineries."
product.customizations.create description: "Kids who sleep in a rooms with water-based paint containing VOCs can be 2-4 times more likely to suffer from asthma (get source)"
product.customizations.create description: "Green Painter offers non-toxic paint that is similar in price to other paints that are toxic.Green Painter's mission is make healthy homes affordable and accessible for EVERYONE."
# c3 = Campaign.create product: product, name: "#{product.name} sender:no-incentives recipient:noncontingent-plant"


### Furniture
product = Product.create name: "'Made @ New Living' artisan furniture"
product.customizations.create description: "Instead of supporting sweatshop or child labor oversees, you are able to directly support local jobs that are building a new responsible workforce."
product.customizations.create description: "Instead of the money going to companies based in other places, you are able to directly invest in local jobs that stay in your community."
product.customizations.create description: "Made At New Living reduces carbon footprint and waste -- nothing is being shipped from overseas!"
product.customizations.create description: "Every piece is hand-made and has a story-- you can watch your piece being made in a collaborative way."
product.customizations.create description: "By creating a direct relationship with a community of local artisan, New Living is able to offer beautiful, well-designed, hand-made pieces at a price competitive or less than other stores."
product.customizations.create description: "For the same reason we choose to eat healthier, organic food, it makes sense to bring into our homes furniture made without harmful chemicals."
product.customizations.create description: "Made at New Living is like a kosher factory for healthy furniture: every single chemical used in the process is the safest, least toxic option available."
# c4 = Campaign.create product: product, name: "#{product.name} sender:no-incentives recipient:noncontingent-plant"


### Mattress
product = Product.create name: "Organic mattress"
product.customizations.create description: "It's not just about the food! For the exact same reasons that we want to eat healthier, organic food, it makes sense to sleep on a mattress free of toxic"
product.customizations.create description: "Did you know that a popular memory foam mattress contains 61 VOCs and 4 Carcinogens, these chemicals increase the likelihood of cancer and diseases like asthma?"
product.customizations.create description: "With a note from a medical Doctor advising an air filtration system, no sales tax is charged. You can also use a discretionary spending account with your insurance provider to pay for an air filter."
product.customizations.create description: "An organic mattress also uses substantially fewer chemicals and volatile organic compounds to produce, meaning it contributes less overall pollution to the environment."
product.customizations.create description: "All of New Living's mattresses are produced by hand in the United States."
# c5 = Campaign.create product: product, name: "#{product.name} sender:no-incentives recipient:noncontingent-plant"
c1 = Campaign.create name: "in-store-version sender:no-incentives recipient:noncontingnet-plant"
  end

##################################################









end
