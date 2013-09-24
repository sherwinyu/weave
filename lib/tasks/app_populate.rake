namespace :weave do
  desc 'Converts from single-client to multi-client architecture'
  task :createNewLivingClient => [:environment ] do
    client = Client.find_or_initialize_by_name "New Living"
    puts "find or initialize by name for new living: #{client.inspect}"
    client.save(validate: false)

    products = Product.where(client_id: nil)
    puts "Updating #{products.count} products: assign new client_id #{client.id}"
    products.update_all client_id: client.id

    campaigns = Campaign.where(client_id: nil)
    puts "Updating #{campaigns.count} campaigns: assign new client_id #{client.id}"
    campaigns.update_all client_id: client.id
  end

  task :addKeyToNewLivingClient => [:environment] do
    client = Client.find_or_initialize_by_name "New Living"
    puts "find or initialize by name for new living: #{client.inspect}"
    client.key = "newliving"
    client.save(validate: false)
  end

  task :updateNewLivingCopy => [:environment] do
    client = Client.NL
    client.referral_message = "I just shopped at New Living, a mission-driven Certified Benefit Corporation that has made a commitment to measure success on a social, environmental and economic level. I know you care a lot about where you shop, so I thought I'd let you know about New Living."
    client.intro_message = "Tell your friends about New Living's socially responsible products."
    client.save(validate: false)

  end


  ##################################################

  task :populateE3 => [:environment] do
    client = Client.find_by_name "E3 Innovate"
    if client
      puts "destroying existing client #{client.inspect}"
      client.clean!
      client.destroy
    end
    client = Client.create name: "E3 Innovate",
      referral_message: "Yo, refer E3 dawg.",
      intro_message: "Yo, E3 is dope"

    puts "Populating E3 objects"

    product = client.products.create name: "E3 Innovate product 1"
    product.customizations.create description: "product1 description1"
    product.customizations.create description: "product1 description2"
    product.customizations.create description: "product1 description3"
    product.customizations.create description: "product1 description4"
    product.customizations.create description: "product1 description5"

    product = client.products.create name: "E3 Innovate product 2"
    product.customizations.create description: "product2 description1"
    product.customizations.create description: "product2 description2"
    product.customizations.create description: "product2 description3"
    product.customizations.create description: "product2 description4"
    product.customizations.create description: "product2 description5"

    campaign = client.campaigns.create(
      description: "default online campaign",
      referral_message: "Yo, refer E3 dawg.",
      intro_message: "Yo, E3 is dope",
      mailing_campaign: true
    )
    client.save
  end

  ##################################################
  ##################################################
  ##################################################

  task :populateNewLiving => [:environment] do
    client = Client.find_by_name "New Living"
    if client
      puts "destroying existing client #{client.inspect}"
      client.clean!
      client.destroy
    end
    client = Client.create name: "New Living",
      key: "newliving",
      referral_message: "I just shopped at New Living, a mission-driven Certified Benefit Corporation that has made a commitment to measure success on a social, environmental and economic level. I know you care a lot about where you shop, so I thought I'd let you know about New Living.",
      intro_message: "Tell your friends about New Living's socially responsible products."

    puts "Populating New Living objects"
    binding.pry

    campaign = client.campaigns.create(
      description: "default online campaign",
      referral_message: "I just shopped at New Living, a mission-driven Certified Benefit Corporation that has made a commitment to measure success on a social, environmental and economic level. I know you care a lot about where you shop, so I thought I'd let you know about New Living.",
      intro_message: "Tell your friends about New Living's socially responsible products.",
      mailing_campaign: true
    )
    client.save

    ### Air Filter::
    product = client.products.create name: "Premium Air Filtration System"
    product.customizations.create description: "According to the EPA, indoor air is about 200% more polluted than outside air."
    product.customizations.create description: "Houston has the highest rate of childhood asthma among any major US city."
    product.customizations.create description: "With a note from a medical Doctor advising an air filtration system, no sales tax is charged. You can also use a discretionary spending account with your insurance provider to pay for an air filter."
    product.customizations.create description: "Compared to the size of their bodies, children take in more air than adults do and are therefore at a higher risk of being affected by polluted air."
    product.customizations.create description: "New Living air filters removes benzene, wood smoke, formaldehyde, other VOCs, bacteria, and viruses from the air."
    product.customizations.create description: "New Living's Air Filtration machines are great for the nursery as they remove dust, pollen, and harmful gases from the air. They also reduce nighttime asthma, allergies, runny nose, congestion, dry mouth, coughing and wheezing."
    # c1 = Campaign.create product: product, name: "#{product.name} sender:no-incentives recipient:noncontingent-plant"


    ### Water Filter:
    product = client.products.create name: "Premium Water Filtration System"
    product.customizations.create description: "Traditional filters don't cut it. Our body is composed of 70% water, and more water absorbs into our skin when we bathe than when we drink."
    product.customizations.create description: "With a note from a medical Doctor advising a water filtration system, no sales tax is charged. You can also use a discretionary spending account with your insurance provider to pay for your filter."
    product.customizations.create description: "Houston's water supply contains high concentrations of 18 contaminants ranging from arsenic to chlorine, making it the 6th most contaminated water in the country (EWG Study)"
    product.customizations.create description: "You will not have to purchase bottled water again once you have a whole home filtration system."
    # c2 = Campaign.create product: product, name: "#{product.name} sender:no-incentives recipient:noncontingent-plant"


    ### Green Painter
    product = client.products.create name: "Green Painter VOC free paint"
    product.customizations.create description: "The average lifespan of a painter is only 54 years old according to the World Health Organization. You can help change that by using healthier chemicals in your home improvement project!"
    product.customizations.create description: "Painted surfaces, like homes and buildings, give off 25% more toxins per day than gas stations and oil refineries."
    product.customizations.create description: "Kids who sleep in a rooms with water-based paint containing VOCs can be 2-4 times more likely to suffer from asthma (get source)"
    product.customizations.create description: "Green Painter offers non-toxic paint that is similar in price to other paints that are toxic.Green Painter's mission is make healthy homes affordable and accessible for EVERYONE."
    # c3 = Campaign.create product: product, name: "#{product.name} sender:no-incentives recipient:noncontingent-plant"


    ### Furniture
    product = client.products.create name: "'Made @ New Living' artisan furniture"
    product.customizations.create description: "Instead of supporting sweatshop or child labor oversees, you are able to directly support local jobs that are building a new responsible workforce."
    product.customizations.create description: "Instead of the money going to companies based in other places, you are able to directly invest in local jobs that stay in your community."
    product.customizations.create description: "Made At New Living reduces carbon footprint and waste -- nothing is being shipped from overseas!"
    product.customizations.create description: "Every piece is hand-made and has a story-- you can watch your piece being made in a collaborative way."
    product.customizations.create description: "By creating a direct relationship with a community of local artisan, New Living is able to offer beautiful, well-designed, hand-made pieces at a price competitive or less than other stores."
    product.customizations.create description: "For the same reason we choose to eat healthier, organic food, it makes sense to bring into our homes furniture made without harmful chemicals."
    product.customizations.create description: "Made at New Living is like a kosher factory for healthy furniture: every single chemical used in the process is the safest, least toxic option available."
    # c4 = Campaign.create product: product, name: "#{product.name} sender:no-incentives recipient:noncontingent-plant"


    ### Mattress
    product = client.products.create name: "Organic mattress"
    product.customizations.create description: "It's not just about the food! For the exact same reasons that we want to eat healthier, organic food, it makes sense to sleep on a mattress free of toxic"
    product.customizations.create description: "Did you know that a popular memory foam mattress contains 61 VOCs and 4 Carcinogens, these chemicals increase the likelihood of cancer and diseases like asthma?"
    product.customizations.create description: "With a note from a medical Doctor advising an air filtration system, no sales tax is charged. You can also use a discretionary spending account with your insurance provider to pay for an air filter."
    product.customizations.create description: "An organic mattress also uses substantially fewer chemicals and volatile organic compounds to produce, meaning it contributes less overall pollution to the environment."
    product.customizations.create description: "All of New Living's mattresses are produced by hand in the United States."

    campaign = client.campaigns.create name: "in-store-version sender:no-incentives recipient:noncontingnet-plant"
    client.save
  end

  ##################################################
  #
  task :populateDemo => [:environment] do
    client = Client.find_by_name "New Living (demo)"
    if client
      puts "destroying existing client #{client.inspect}"
      client.clean!
      client.destroy
    end
    client = Client.create name: "New Living (demo)",
      key: "newliving",
      referral_message: "I just shopped at New Living (demo), a mission-driven Certified Benefit Corporation that has made a commitment to measure success on a social, environmental and economic level. I know you care a lot about where you shop, so I thought I'd let you know about New Living.",
      intro_message: "Tell your friends about New Living (demo)'s socially responsible products. Get a $50 Whole Foods Gift Card!"

    puts "Populating New Living (demo) objects"

    campaign = client.campaigns.create(
      description: "default online campaign",
      referral_message: "I just shopped at New Living, a mission-driven Certified Benefit Corporation that has made a commitment to measure success on a social, environmental and economic level. I know you care a lot about where you shop, so I thought I'd let you know about New Living.",
      intro_message: "Tell your friends about New Living's socially responsible products. Get a $50 Whole Foods Gift Card!",
      mailing_campaign: true
    )
    client.save

    ### Air Filter::
    product = client.products.create name: "Premium Air Filtration System"
    product.customizations.create description: "According to the EPA, indoor air is about 200% more polluted than outside air."
    product.customizations.create description: "Houston has the highest rate of childhood asthma among any major US city."


    ### Water Filter:
    product = client.products.create name: "Premium Water Filtration System"
    product.customizations.create description: "Traditional filters don't cut it. Our body is composed of 70% water, and more water absorbs into our skin when we bathe than when we drink."


    ### Green Painter
    product = client.products.create name: "Green Painter VOC free paint"
    product.customizations.create description: "The average lifespan of a painter is only 54 years old according to the World Health Organization. You can help change that by using healthier chemicals in your home improvement project!"
    product.customizations.create description: "Painted surfaces, like homes and buildings, give off 25% more toxins per day than gas stations and oil refineries."


    ### Furniture
    product = client.products.create name: "'Made @ New Living' artisan furniture"
    product.customizations.create description: "Instead of supporting sweatshop or child labor oversees, you are able to directly support local jobs that are building a new responsible workforce."
    product.customizations.create description: "Instead of the money going to companies based in other places, you are able to directly invest in local jobs that stay in your community."

    campaign = client.campaigns.create name: "in-store-version sender:no-incentives recipient:noncontingnet-plant"
    client.save
  end

  ##################################################

  ##################################################
  ##################################################
  ##################################################
  #
  task :populateSunpro => [:environment] do

    client = Client.find_or_create_by_key "sunpro"
    puts "client #{client.persisted? ? 'already exists!': 'created'}: #{client.inspect}"
    client.update_attributes(
      name: "Sunpro",
      key: "sunpro",
      referral_message: "I just went solar with Sunpro Solar Home Specialists, the #1 rated solar company on Angie's List. It's a great investment for me and I thought you might be interested too.",
      intro_message: "Share the solar love at Sunpro with your friends and family"
    )

    campaign = client.campaigns.find_or_create_by_description "default online campaign"
    puts "campaign #{campaign.persisted? ? 'already exists!': 'created'}: #{campaign.inspect}"
    campaign.update_attributes(
      referral_message: "I just went solar with Sunpro Solar Home Specialists, the #1 rated solar company on Angie's List. It's a great investment for me and I thought you might be interested too.",
      intro_message: "Share the solar love at Sunpro with your friends and family",
      email_subject: "%{sender_first_name} thought you'd be interested in Sunpro Solar",
      mailing_campaign: true
    )

    client.save
    ### Sunpro services
=begin
    product = client.products.find_or_create_by_name  "Tell a friend about Sunpro Solar"
    puts "product #{product.inspect} #{product.persisted? ? 'already exists!': 'created'}"
    product.customizations.create description: "Louisiana has the best solar rebates in the country: get tax breaks to pay for 80% of your system"
    product.customizations.create description: "You can own solar for less than it costs to lease it"
    product.customizations.create description: "The average out of pocket cost is less than $4,000"
    product.customizations.create description: "Reduce your carbon footprint: A solar installation reduces your footprint by 4,000 lbs of CO2 -- equivalent to planting 8,000 trees"
    product.customizations.create description: "Worry free: get a 25 year product and labor warranty and a 20 year energy production guarantee"
=end
  end

  ##################################################


  ##################################################
  ##################################################
  ##################################################

  task :populate1BOG => [:environment] do

    client = Client.find_or_create_by_key "1bog"
    puts "client #{client.persisted? ? 'already exists!': 'created'}: #{client.inspect}"
    client.update_attributes(
      name: "One Block Off the Grid",
      key: "1bog",
      referral_message: "One Block Off the Grid helped me go solar, and I thought you'd be interested too.",
      intro_message: "Share the solar love at One Block off the Grid with your friends and family"
    )

    campaign = client.campaigns.find_or_create_by_description "default online campaign"
    puts "campaign #{campaign.persisted? ? 'already exists!': 'created'}: #{campaign.inspect}"
    campaign.update_attributes(
      referral_message: "One Block Off the Grid helped me go solar, and I thought you'd be interested too.",
      intro_message: "Share the solar love at One Block off the Grid with your friends and family",
      email_subject: "%{sender_first_name} thought you'd be interested in going solar with One Block Off the Grid"
    )

    client.save

    ### 1BOG
=begin
    product = client.products.create name: "Tell a friend about One Block Off the Grid"
    product.customizations.create description: "No Upfront costs: go solar for $0 down with free installation"
    product.customizations.create description: "Lock in your energy rate for 20 years: energy prices are volatile, so going solar makes sure you know what you'll pay"
    product.customizations.create description: "Increase your home value: solar is one of the best investments in increasing your home's resale value"
    product.customizations.create description: "Save money every month: see your savings on every utility bill"
    product.customizations.create description: "Reduce your carbon footprint: A typical 5kW solar system offsets 260,000 lbs of CO2 over 25 years. That's 400,000 miles of driving!"
    product.customizations.create description: "Create local jobs: Install solar and create great jobs in your community"
=end
  end
end
