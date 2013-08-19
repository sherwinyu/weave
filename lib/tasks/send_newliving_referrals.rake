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

    recipient = User.find_or_create_by_name_and_email "David", "david.kaplan@chron.com"
    customization = customization_labor
    referral = sender.sent_referrals.create customizations: [customization], campaign: campaign, product: client_product, recipient: recipient, sender_email: sender.email, recipient_email: recipient.email
    del = referral.deliver
    binding.pry
  end
=begin
7/8/2013 14:47:27	Melissa Eason	melissakeason@gmail.com	VOC free paint
David	david.kaplan@chron.com	Our commitment to fair labor and social practices
Paul	paul@pauleason.com	Our focus on personal health	Hope	hopah33@gmail.com	Our focus on personal health	Anne	anneason1@msn.com	The home comfort of our products	Chuck	csl@yahoo.com	Our commitment to fair labor and social practices

7/17/2013 14:58:13	Lulu Lopez	lulu@lululopez.com	VOC free paint
Michelle	Tuchelita@gmail.com	Our focus on personal health
Emily	aboulomania@gmail.com	Our environmental impact
Rhia	heyrhia@gmail.com	Our focus on personal health
Mojdeh	mojdehp@gmail.com	Our focus on personal health

7/17/2013 15:58:57	Prarthy	prathydurgam@gmail.com	VOC free paint
pratibha	durgam.pratibha@gmail.com	Our focus on personal health
lakshmi Gummadi	lakshmi_gummadi@yahoo.com	Our focus on personal health
Jay Pranavamurthi	jayprana08@gmail.com	Our focus on personal health
Kathi Rosamond	ksrosamond@comcast.net	Our environmental impact
Anitha	an_nu8@yahoo.com	Our focus on personal health

7/18/2013 12:06:59	Dr. Elangovan Krishnan	DOCELAN@GMAIL.COM	VOC free paint
JANSI RANI SETHURAJ	JANSIELAN@GMAIL.COM	Our focus on personal health

8/4/2013 17:19:44	Sarah Jones	sarah@bambooleasing.com	VOC free paint
Michael Craig	mjkccc@gmail.com	Our environmental impact
Andrea Lightfoot	andrea@bambooleasing.com	The home comfort of our products
Sherwin Brandford	sbrandford1@gmail.com	The home comfort of our products
John Kapla	johnkapla@yahoo.com	Our environmental impact

8/7/2013 20:27:03	Rob	ronaldkristene@gmail.com	Organic mattress
Aaron	aron.harris.1614@facebook.com	Our environmental impact

8/17/2013 2:13:06	Kimberly Meyer	meyerhill@hotmail.com	VOC free paint
Georgina Key	georginakey@gmail.com	Our environmental impact
Gabriela Maya	gmayabrazil@hotmail.com	Our environmental impact
Leona Hamill	lmhammill@gmail.com	Our environmental impact
Tracy Donaldson	tracy@growingforgood.com	Our commitment to fair labor and social practices
Angela Apte	angela297@hotmail.com	Our commitment to fair labor and social practices
=end
end
