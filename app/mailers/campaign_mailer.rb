class CampaignMailer < ActionMailer::Base
  def outreach
    mail do |format|
      format.text
      format.html
    end
  end
  def self.outreach_text_part
    outreach.text_part.body
  end
  def self.outreach_html_part
    outreach.html_part.body
  end
end
