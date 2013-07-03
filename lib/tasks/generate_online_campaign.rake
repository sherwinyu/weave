namespace :weave do
  desc 'Waga waga'

##################################################

  task :generate_online_campaign, [:list_id, :deliver, :solo_online_campaign] => [:environment] do |t, args|
    product = Product.first
    online_cpgs = Campaign.where(mailing_campaign: true)
    if online_cpgs.present? && args.solo_onlin_campaign
      puts "Forcing one online campaign..."
      if online_cpgs.length == 1
        puts "One online campaign #{online_cpgs.first} found -- destroying"
        online_cpgs.first.destroy
      else
        puts "Multiple (#{online_cpgs.count}) online campaigns already found -- aborting"
        return
      end
    end
    binding.pry
    cpg = Campaign.create product: product, mailing_campaign: true, name: "#{product.name} online sender:no-incentives recipient:nocontingent-plant"
    cpg.mailchimp_create_campaign list_id: args.list_id
    cpg.generate_referral_batches!
    if args.deliver=="deliver"
      cpg.deliver!
    end
  end

##################################################
end
