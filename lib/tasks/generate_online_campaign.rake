namespace :weave do
  desc 'Waga waga'

##################################################

  task :generate_online_campaign, [:solo_online_campaign, :list_id, :deliver] => [:environment] do |t, args|
    online_cpgs = Campaign.where(mailing_campaign: true)
    if online_cpgs.present? && args.solo_online_campaign == "force_solo"
      puts "Forcing one online campaign..."
      if online_cpgs.length == 1
        puts "One online campaign #{online_cpgs.first} found -- destroying"
        online_cpgs.first.destroy
      else
        puts "Multiple (#{online_cpgs.count}) online campaigns already found -- aborting"
        return
      end
    end
    cpg = Campaign.create mailing_campaign: true, name: "Online-experiment1 sender:no-incentives recipient:nocontingent-plant"
    cpg.mailchimp_create_campaign list_id: args.list_id
    cpg.generate_referral_batches!
    if args.deliver=="deliver"
      cpg.deliver!
    end
  end

##################################################
end
