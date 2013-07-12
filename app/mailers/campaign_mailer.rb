class CampaignMailer < ActionMailer::Base
  def outreach(campaign)
    @referral_url = "http://#{Figaro.env.DOMAIN}/?campaign_id=#{campaign.id}&landing_email=*|EMAIL|*"
    mail do |format|
      format.text
      format.html
    end
  end
  def self.outreach_text_part(campaign)
    outreach(campaign).text_part.body
  end
  def self.outreach_html_part(campaign)
    outreach(campaign).html_part.body
  end
end
