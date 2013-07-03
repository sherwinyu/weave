# == Schema Information
#
# Table name: campaigns
#
#  id                     :integer          not null, primary key
#  name                   :string(255)
#  description            :text(255)
#  outreach_email_content :text(255)
#  sender_page_content    :text(255)
#  recipient_page_content :text(255)
#  live                   :boolean
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  product_id             :integer
#

class Campaign < ActiveRecord::Base
  # attr_accessible :name, :description, :outreach_email_content, :sender_page_content, :recipient_page_content, :live, :product

  has_and_belongs_to_many :sender_incentives, class_name: "Incentive", join_table: "campaigns_sender_incentives"
  has_and_belongs_to_many :recipient_incentives, class_name: "Incentive", join_table: "campaigns_recipient_incentives"

  has_many :referral_batches
  has_many :referrals, through: :referral_batches, inverse_of: :campaign
  has_many :senders, through: :referral_batches
  has_many :recipients, through: :referral_batches
  belongs_to :product, inverse_of: :campaigns

  # mailchimp_campaign_id
  # mailchimp_list_id

  # creates
  def mailchimp_campaign_recipients
    if mailing_campaign? && mailchimp_list
      Campaign.mailchimp.listMembers id: self.mailchimp_list
    end
  end

  MailChimpProxy = Class.new do
    def initialize(gibbon)
      @gibbon = gibbon
      @exclude_list = [:campaignCreate]
    end

    def method_missing method_name, *args, &block
      if @exclude_list.include? method_name
        @gibbon.send method_name, *args, &block
      else
        Hashie::Mash.new @gibbon.send method_name, *args, &block
      end
    end
  end

  def self.mailchimp
    @gb ||= MailChimpProxy.new(Gibbon.new Figaro.env.mailchimp_client_api_key)
  end

  def self.mailchimp2
    @gb ||= MailChimpProxy.new(Gibbon.new Figaro.env.NEW_LIVING_API_KEY)
  end

  def mailchimp_write_emails_from_campaign
    data = Campaign.mailchimp2.campaignContent cid: mailchimp_campaign_id, for_archive: false
    f = File.open '/home/syu/projects/weave/app/views/campaign_mailer/outreach.html.erb', 'w'
    f.write data.html
    f.close
    f = File.open '/home/syu/projects/weave/app/views/campaign_mailer/outreach.text.erb', 'w'
    f.write data.text
    f.close
  end
  def mailchimp_upsert_campaign
  end

  def mailchimp_create_campaign
    opts = Hashie::Mash.new
    opts.subject = "Help NewLiving spread values-based shopping in Houston"
    opts.from_name = "New Living Team"
    opts.from_email = "getgreen@#{Figaro.env.MAILCHIMP_CLIENT_DOMAIN}"
    opts.to_name = '*|FNAME|* *|LNAME|*'
    opts.list_id = 'a0fa181d00' # TODO(syu) DON'T HARD CODE THIS
    content = Hashie::Mash.new
    content.text = CampaignMailer.outreach_text_part.to_s
    content.html = CampaignMailer.outreach_html_part.to_s
    self.mailchimp_campaign_id = Campaign.mailchimp.campaignCreate type: "regular", options: opts, content: content
  end

  def mailchimp_list_id
    Campaign.mailchimp # TODO...
  end

  def self.create_new_campaign
    opts = Hashie::Mash.new
    opts.list_id = 'a0fa181d00' # TODO(syu) DON'T HARD CODE THIS
    opts.from_email = "whatever@weaveenergy.com"
    opts.from_name = "NewLiving"
    opts.to_name = 'i guess your name is *|FNAME|*'
    opts.subject = "WeaveOutreachOnlineQueryStringParamsTrackingPart2"
    content = Hashie::Mash.new
    content.text = "walawala bitchass"
    content.html = '
    <h1>walawala</h1> sup *|FNAME|*, here are some more merge tags <br><br> *|LNAME|* *|EMAIL|* <br> Here are some links to be tracked <a href="http://weaveenergy.com">click me</a><br>
    Here s another link with query string params: <a href="http://localhost:4000/?campaign_id=7&landing_email=*|EMAIL|*"> params!! </a>.
    '
    mailchimp.campaignCreate type: "regular", options: opts, content: content
  end

  def self.campaign_analytics cid
    mailchimp.campaignClickDetailAIM cid: "00ab1b1e39", url: "http://weaveenergy.com"
# => {"total"=>2, "data"=>[{"email"=>"sherwin@communificiency.com", "clicks"=>2}, {"email"=>"sherwin@weaveenergy.com", "clicks"=>1}]}

    mailchimp.campaignEmailStatsAIMAll cid: cid
=begin
{"total"=>4,
 "data"=>
  {"sherwin@communificiency.com"=>
    [{"action"=>"open",
      "timestamp"=>"2013-06-26 21:34:37",
      "url"=>nil,
      "ip"=>"216.80.147.191"},
     {"action"=>"click",
      "timestamp"=>"2013-06-26 21:34:37",
      "url"=>"http://weaveenergy.com",
      "ip"=>"216.80.147.191"},
     {"action"=>"click",
      "timestamp"=>"2013-06-26 21:35:04",
      "url"=>"http://weaveenergy.com",
      "ip"=>"216.80.147.191"}],
   "max@communificiency.com"=>[],
   "sherwin@weaveenergy.com"=>
    [{"action"=>"open",
      "timestamp"=>"2013-06-26 21:36:24",
      "url"=>nil,
      "ip"=>"216.80.147.191"},
     {"action"=>"click",
      "timestamp"=>"2013-06-26 21:42:01",
      "url"=>"http://weaveenergy.com",
      "ip"=>"216.80.147.191"}],
   "max@weaveenergy.com"=>[]}}
=end
  end

end
