class ReferralMailer < ActionMailer::Base
  def self.deliver( referral, options={} )
    data_hash = self.referral_to_data_hash referral, options
    self.mailgun_deliver data_hash
  end

  # call the proper template_name method
  # convert the returned mailer object into a data hash
  # set additional properties (campaign, testmode) on the data hash
  # return the data hash
  # NOTE: individual testing of template methods should be done in their own tests
  def self.referral_to_data_hash referral, options
    data = Multimap.new
    template_name = options[:template] || :sender_to_recipient
    mail = ReferralMailer.send template_name, referral
    data[:from] = mail.from
    data[:to] = mail.to

    data[:subject] = mail.subject #"Hello"
    data[:text] = mail.text_part.body # "Testing some Mailgun awesomness!"
    data[:html] = mail.html_part.body # "<html>HTML version of the body</html>"
    data['o:campaign']='newliving'
    data['o:testmode'] = true if Rails.env.testing? || Rails.env.development?
    data
  end

  # TODO(syu): pull out into its own module
  def self.mailgun_deliver data_hash
    domain = Figaro.env.mailgun_api_domain
    url = "https://api:#{Figaro.env.MAILGUN_API_KEY}@api.mailgun.net/v2/#{domain}/messages"
    logger.info url
    logger.info data_hash.inspect
    logger.info RestClient.post url, data_hash
  end

  def sender_to_recipient_referral_newliving(referral)
    @referral = referral
    @sender = referral.sender
    @recipient = referral.recipient
    @product = referral.product
    @client = referral.client
    mail(
      to: @referral.recipient_email,
      subject: "#{@sender.full_name} thought you'd be interested in NewLiving",
      from: "#{@sender.full_name} <#{@referral.sender_email}>"
        ) do |format|
      format.text
      format.html
    end
  end

  def sender_to_recipient(referral)
    @referral = referral
    @sender = referral.sender
    @recipient = referral.recipient
    @product = referral.product
    @client = referral.client
    mail(
      to: @referral.recipient_email,
      subject: "#{@sender.full_name} thought you'd be interested in NewLiving",
      from: "#{@sender.full_name} <#{@referral.sender_email}>"
        ) do |format|
      format.text
      format.html
    end
  end
end
