namespace :weave do
  desc "Create and generate online referrals"
  task :sendNewLivingReferrals => [:environment ] do
    client = Client.NL
    campaign = Campaign.create client: client, description: "Getting referrals out"
    client_product = client.products.create name: "New Living"
    customization_enviro  = client_product.customizations.find_or_create_by_description "our environmentally friendly practices"
    customization_health  = client_product.customizations.create description: "our focus on personal and family health"
    customization_labor   = client_product.customizations.create description: "our commitment to fair labor and social practices"
    customization_comfort = client_product.customizations.create description: "the home comfort of our products"

# 7/8/2013 14:47:27	Melissa Eason	melissakeason@gmail.com	VOC free paint
    # David	david.kaplan@chron.com	Our commitment to fair labor and social practices
    # Paul	paul@pauleason.com	Our focus on personal health
    # Hope	hopah33@gmail.com	Our focus on personal health
    # Anne	anneason1@msn.com	The home comfort of our products
    # Chuck	csl@yahoo.com	Our commitment to fair labor and social practices
    sender = User.find_or_create_by_name_and_email "Melissa Eason", "melissakeason@gmail.com"

    recipient = User.find_or_create_by_email "david.kaplan@chron.com"
    recipient.name = "David Kaplan"
    customization = customization_labor
    referral = sender.sent_referrals.create customizations: [customization], campaign: campaign, product: client_product, recipient: recipient, sender_email: sender.email, recipient_email: recipient.email
    puts "#{referral.recipient.email} -> #{referral.sender.email}: #{referral.customizations.first.description} -- success: #{referral.deliver template: :sender_to_recipient_referral_newliving}"

    recipient = User.find_or_create_by_email "paul@pauleason.com"
    recipient.name = "Paul"
    customization = customization_health
    referral = sender.sent_referrals.create customizations: [customization], campaign: campaign, product: client_product, recipient: recipient, sender_email: sender.email, recipient_email: recipient.email
    puts "#{referral.recipient.email} -> #{referral.sender.email}: #{referral.customizations.first.description} -- success: #{referral.deliver template: :sender_to_recipient_referral_newliving}"

    recipient = User.find_or_create_by_email "hopah33@gmail.com"
    recipient.name = "Hope"
    customization = customization_health
    referral = sender.sent_referrals.create customizations: [customization], campaign: campaign, product: client_product, recipient: recipient, sender_email: sender.email, recipient_email: recipient.email
    puts "#{referral.recipient.email} -> #{referral.sender.email}: #{referral.customizations.first.description} -- success: #{referral.deliver template: :sender_to_recipient_referral_newliving}"

    recipient = User.find_or_create_by_email "anneason1@msn.com"
    recipient.name = "Anne"
    customization = customization_comfort
    referral = sender.sent_referrals.create customizations: [customization], campaign: campaign, product: client_product, recipient: recipient, sender_email: sender.email, recipient_email: recipient.email
    puts "#{referral.recipient.email} -> #{referral.sender.email}: #{referral.customizations.first.description} -- success: #{referral.deliver template: :sender_to_recipient_referral_newliving}"

    recipient = User.find_or_create_by_email "csl@yahoo.com"
    recipient.name = "Chuck"
    customization = customization_labor
    referral = sender.sent_referrals.create customizations: [customization], campaign: campaign, product: client_product, recipient: recipient, sender_email: sender.email, recipient_email: recipient.email
    puts "#{referral.recipient.email} -> #{referral.sender.email}: #{referral.customizations.first.description} -- success: #{referral.deliver template: :sender_to_recipient_referral_newliving}"

=begin
7/17/2013 14:58:13	Lulu Lopez	lulu@lululopez.com	VOC free paint
Michelle	Tuchelita@gmail.com	Our focus on personal health
Emily	aboulomania@gmail.com	Our environmental impact
Rhia	heyrhia@gmail.com	Our focus on personal health
Mojdeh	mojdehp@gmail.com	Our focus on personal health
=end
    sender = User.find_or_create_by_name_and_email "Lulu Lopez", "lulu@lululopez.com"

    recipient = User.find_or_create_by_email "tuchelita@gmail.com"
    recipient.name = "Michelle"
    customization = customization_health
    referral = sender.sent_referrals.create customizations: [customization], campaign: campaign, product: client_product, recipient: recipient, sender_email: sender.email, recipient_email: recipient.email
    puts "#{referral.recipient.email} -> #{referral.sender.email}: #{referral.customizations.first.description} -- success: #{referral.deliver template: :sender_to_recipient_referral_newliving}"

    recipient = User.find_or_create_by_email "aboulomania@gmail.com"
    recipient.name = "Emily"
    customization = customization_enviro
    referral = sender.sent_referrals.create customizations: [customization], campaign: campaign, product: client_product, recipient: recipient, sender_email: sender.email, recipient_email: recipient.email
    puts "#{referral.recipient.email} -> #{referral.sender.email}: #{referral.customizations.first.description} -- success: #{referral.deliver template: :sender_to_recipient_referral_newliving}"

    recipient = User.find_or_create_by_email "heyrhia@gmail.com"
    recipient.name = "Rhia"
    customization = customization_health
    referral = sender.sent_referrals.create customizations: [customization], campaign: campaign, product: client_product, recipient: recipient, sender_email: sender.email, recipient_email: recipient.email
    puts "#{referral.recipient.email} -> #{referral.sender.email}: #{referral.customizations.first.description} -- success: #{referral.deliver template: :sender_to_recipient_referral_newliving}"

    recipient = User.find_or_create_by_email "mojdehp@gmail.com"
    recipient.name = "Mojdeh"
    customization = customization_health
    referral = sender.sent_referrals.create customizations: [customization], campaign: campaign, product: client_product, recipient: recipient, sender_email: sender.email, recipient_email: recipient.email
    puts "#{referral.recipient.email} -> #{referral.sender.email}: #{referral.customizations.first.description} -- success: #{referral.deliver template: :sender_to_recipient_referral_newliving}"

=begin
7/17/2013 15:58:57	Prarthy	prathydurgam@gmail.com	VOC free paint
pratibha	durgam.pratibha@gmail.com	Our focus on personal health
lakshmi Gummadi	lakshmi_gummadi@yahoo.com	Our focus on personal health
Jay Pranavamurthi	jayprana08@gmail.com	Our focus on personal health
Kathi Rosamond	ksrosamond@comcast.net	Our environmental impact
Anitha	an_nu8@yahoo.com	Our focus on personal health
=end

    sender = User.find_or_create_by_name_and_email "Prarthy", "prathydurgam@gmail.com"

    recipient = User.find_or_create_by_email "durgam.pratibha@gmail.com"
    recipient.name = "Pratibha"
    customization = customization_health
    referral = sender.sent_referrals.create customizations: [customization], campaign: campaign, product: client_product, recipient: recipient, sender_email: sender.email, recipient_email: recipient.email
    puts "#{referral.recipient.email} -> #{referral.sender.email}: #{referral.customizations.first.description} -- success: #{referral.deliver template: :sender_to_recipient_referral_newliving}"

    recipient = User.find_or_create_by_email "lakshmi_gummadi@yahoo.com"
    recipient.name = "Lakshmi Gummadi"
    customization = customization_health
    referral = sender.sent_referrals.create customizations: [customization], campaign: campaign, product: client_product, recipient: recipient, sender_email: sender.email, recipient_email: recipient.email
    puts "#{referral.recipient.email} -> #{referral.sender.email}: #{referral.customizations.first.description} -- success: #{referral.deliver template: :sender_to_recipient_referral_newliving}"

    recipient = User.find_or_create_by_email "jayprana08@gmail.com"
    recipient.name = "Jay Pranavamurthi"
    customization = customization_health
    referral = sender.sent_referrals.create customizations: [customization], campaign: campaign, product: client_product, recipient: recipient, sender_email: sender.email, recipient_email: recipient.email
    puts "#{referral.recipient.email} -> #{referral.sender.email}: #{referral.customizations.first.description} -- success: #{referral.deliver template: :sender_to_recipient_referral_newliving}"

    recipient = User.find_or_create_by_email "ksrosamond@comcast.net"
    recipient.name = "Kathi Rosamond"
    customization = customization_enviro
    referral = sender.sent_referrals.create customizations: [customization], campaign: campaign, product: client_product, recipient: recipient, sender_email: sender.email, recipient_email: recipient.email
    puts "#{referral.recipient.email} -> #{referral.sender.email}: #{referral.customizations.first.description} -- success: #{referral.deliver template: :sender_to_recipient_referral_newliving}"

    recipient = User.find_or_create_by_email "an_nu8@yahoo.com"
    recipient.name = "Anitha"
    customization = customization_health
    referral = sender.sent_referrals.create customizations: [customization], campaign: campaign, product: client_product, recipient: recipient, sender_email: sender.email, recipient_email: recipient.email
    puts "#{referral.recipient.email} -> #{referral.sender.email}: #{referral.customizations.first.description} -- success: #{referral.deliver template: :sender_to_recipient_referral_newliving}"

=begin
7/18/2013 12:06:59	Dr. Elangovan Krishnan	DOCELAN@GMAIL.COM	VOC free paint
JANSI RANI SETHURAJ	JANSIELAN@GMAIL.COM	Our focus on personal health
=end

    sender = User.find_or_create_by_name_and_email "Elangovan Krishnan", "docelan@gmail.com"

    recipient = User.find_or_create_by_email "jansielan@gmail.com"
    recipient.name = "Jansi Rani sethuraj"
    customization = customization_health
    referral = sender.sent_referrals.create customizations: [customization], campaign: campaign, product: client_product, recipient: recipient, sender_email: sender.email, recipient_email: recipient.email
    puts "#{referral.recipient.email} -> #{referral.sender.email}: #{referral.customizations.first.description} -- success: #{referral.deliver template: :sender_to_recipient_referral_newliving}"


=begin
8/4/2013 17:19:44	Sarah Jones	sarah@bambooleasing.com	VOC free paint
Michael Craig	mjkccc@gmail.com	Our environmental impact
Andrea Lightfoot	andrea@bambooleasing.com	The home comfort of our products
Sherwin Brandford	sbrandford1@gmail.com	The home comfort of our products
John Kapla	johnkapla@yahoo.com	Our environmental impact
=end

    sender = User.find_or_create_by_name_and_email "Sarah Jones", "sarah@bambooleasing.com"

    recipient = User.find_or_create_by_email "mjkccc@gmail.com"
    recipient.name = "Michael Craig"
    customization = customization_enviro
    referral = sender.sent_referrals.create customizations: [customization], campaign: campaign, product: client_product, recipient: recipient, sender_email: sender.email, recipient_email: recipient.email
    puts "#{referral.recipient.email} -> #{referral.sender.email}: #{referral.customizations.first.description} -- success: #{referral.deliver template: :sender_to_recipient_referral_newliving}"

    recipient = User.find_or_create_by_email "andrea@bambooleasing.com"
    recipient.name = "Andrea Lightfoot"
    customization = customization_comfort
    referral = sender.sent_referrals.create customizations: [customization], campaign: campaign, product: client_product, recipient: recipient, sender_email: sender.email, recipient_email: recipient.email
    puts "#{referral.recipient.email} -> #{referral.sender.email}: #{referral.customizations.first.description} -- success: #{referral.deliver template: :sender_to_recipient_referral_newliving}"

    recipient = User.find_or_create_by_email "sbrandford1@gmail.com"
    recipient.name = "Sherwin Brandford"
    customization = customization_comfort
    referral = sender.sent_referrals.create customizations: [customization], campaign: campaign, product: client_product, recipient: recipient, sender_email: sender.email, recipient_email: recipient.email
    puts "#{referral.recipient.email} -> #{referral.sender.email}: #{referral.customizations.first.description} -- success: #{referral.deliver template: :sender_to_recipient_referral_newliving}"

    recipient = User.find_or_create_by_email "johnkapla@yahoo.com"
    recipient.name = "John Kapla"
    customization = customization_enviro
    referral = sender.sent_referrals.create customizations: [customization], campaign: campaign, product: client_product, recipient: recipient, sender_email: sender.email, recipient_email: recipient.email
    puts "#{referral.recipient.email} -> #{referral.sender.email}: #{referral.customizations.first.description} -- success: #{referral.deliver template: :sender_to_recipient_referral_newliving}"

=begin
8/7/2013 20:27:03	Rob	ronaldkristene@gmail.com	Organic mattress
Aaron	aron.harris.1614@facebook.com	Our environmental impact
=end

    sender = User.find_or_create_by_name_and_email "Rob", "ronaldkristene@gmail.com"

    recipient = User.find_or_create_by_email "aron.harris.1614@facebook.com"
    recipient.name = "Aaron Harris"
    customization = customization_enviro
    referral = sender.sent_referrals.create customizations: [customization], campaign: campaign, product: client_product, recipient: recipient, sender_email: sender.email, recipient_email: recipient.email
    puts "#{referral.recipient.email} -> #{referral.sender.email}: #{referral.customizations.first.description} -- success: #{referral.deliver template: :sender_to_recipient_referral_newliving}"

=begin
8/17/2013 2:13:06	Kimberly Meyer	meyerhill@hotmail.com	VOC free paint
Georgina Key	georginakey@gmail.com	Our environmental impact
Gabriela Maya	gmayabrazil@hotmail.com	Our environmental impact
Leona Hamill	lmhammill@gmail.com	Our environmental impact
Tracy Donaldson	tracy@growingforgood.com	Our commitment to fair labor and social practices
Angela Apte	angela297@hotmail.com	Our commitment to fair labor and social practices
=end

    sender = User.find_or_create_by_name_and_email "Kimberly Meyer", "meyerhill@hotmail.com"

    recipient = User.find_or_create_by_email "georginakey@gmail.com"
    recipient.name = "Georgina Key"
    customization = customization_enviro
    referral = sender.sent_referrals.create customizations: [customization], campaign: campaign, product: client_product, recipient: recipient, sender_email: sender.email, recipient_email: recipient.email
    puts "#{referral.recipient.email} -> #{referral.sender.email}: #{referral.customizations.first.description} -- success: #{referral.deliver template: :sender_to_recipient_referral_newliving}"

    recipient = User.find_or_create_by_email "gmayabrazil@hotmail.com"
    recipient.name = "Gabriela Maya"
    customization = customization_enviro
    referral = sender.sent_referrals.create customizations: [customization], campaign: campaign, product: client_product, recipient: recipient, sender_email: sender.email, recipient_email: recipient.email
    puts "#{referral.recipient.email} -> #{referral.sender.email}: #{referral.customizations.first.description} -- success: #{referral.deliver template: :sender_to_recipient_referral_newliving}"

    recipient = User.find_or_create_by_email "lmhammill@gmail.com"
    recipient.name = "Leona Hamill"
    customization = customization_enviro
    referral = sender.sent_referrals.create customizations: [customization], campaign: campaign, product: client_product, recipient: recipient, sender_email: sender.email, recipient_email: recipient.email
    puts "#{referral.recipient.email} -> #{referral.sender.email}: #{referral.customizations.first.description} -- success: #{referral.deliver template: :sender_to_recipient_referral_newliving}"

    recipient = User.find_or_create_by_email "tracy@growingforgood.com"
    recipient.name = "Tracy Donaldson"
    customization = customization_labor
    referral = sender.sent_referrals.create customizations: [customization], campaign: campaign, product: client_product, recipient: recipient, sender_email: sender.email, recipient_email: recipient.email
    puts "#{referral.recipient.email} -> #{referral.sender.email}: #{referral.customizations.first.description} -- success: #{referral.deliver template: :sender_to_recipient_referral_newliving}"

    recipient = User.find_or_create_by_email "angela297@hotmail.com"
    recipient.name = "Angela Apte"
    customization = customization_labor
    referral = sender.sent_referrals.create customizations: [customization], campaign: campaign, product: client_product, recipient: recipient, sender_email: sender.email, recipient_email: recipient.email
    puts "#{referral.recipient.email} -> #{referral.sender.email}: #{referral.customizations.first.description} -- success: #{referral.deliver template: :sender_to_recipient_referral_newliving}"
  end
end
