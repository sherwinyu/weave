class CampaignMailer < ActionMailer::Base
  def outreach
    mail do |format|
      format.text
      format.html
    end
  end
end
