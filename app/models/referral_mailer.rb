class ReferralMailer < ActionMailer::Base

  def sender_to_recipient(referral)
    @referral = referral
    @sender = referral.sender
    @recipient = referral.recipient
    @product = referral.product
    @client = "New Living"
    mail(
      to: @referral.recipient_email,
      subject: "#{@sender.name} thought you'd be interested in NewLiving",
      from: "#{@sender.name} <#{@referral.sender_email}>"
        ) do |format|
      format.text
      format.html
    end

  end

end
