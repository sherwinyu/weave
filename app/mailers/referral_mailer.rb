class ReferralMailer < ActionMailer::Base
  def self.deliver( referral, options={} )
    data_hash = self.referral_to_data_hash referral, options
    self.mailgun_deliver data_hash
  end

  # Generates a multimap hash that can be serialized by RestClient
  #   and consumed by the mailgun HTTP api
  # Context:
  #   called by self.deliver to generate a data_hash,
  #   data_hash is passed into mailgun_deliver
  # call the proper template_name method
  # convert the returned mailer object into a data hash
  # set additional properties (campaign, testmode) on the data hash
  # return the data hash
  # NOTE: individual testing of template methods should be done in their own tests
  def self.referral_to_data_hash referral, options
    method_name = options[:method] || :sender_to_recipient

    # template_name = options[:template] || "#{__method__}_#{referral.client.key}"
    # options[:template] ||= options[:template] || method_name

    data = Multimap.new

    mail = ReferralMailer.send method_name, referral, options
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

  # TEMPLATE METHODS
  #
  # Each of the following template methods correspond to a template'd email.
  # The duty of these methods is to setup the instance variables for the email template.
  # The template method returns a mail object, which includes to/subject/from/body,
  # which then gets converted to a payload for the mailgun api.
  #
  # Context:
  #   Called by referral_data_to_hash via `send`  to return a mail object, which gets
  #     parsed into the data hash.
  #      - method_name is stored in options[:template]

  # sender_to_recipient_referral_newliving
  # Used only to send out the referrals for newliving collected from the Google form
  # when the app was inactive during August
  def sender_to_recipient_referral_newliving(referral, options={})
    setup_instance_variables(referral)
    mail(
      to: @referral.recipient_email,
      subject: "#{@sender.full_name} thought you'd be interested in NewLiving",
      from: "#{@sender.full_name} <#{@referral.sender_email}>"
        ) do |format|
      format.text
      format.html
    end
  end

  # sender_to_recipient
  # Used only to send out the referrals for newliving collected from the Google form
  # when the app was inactive during August
  def sender_to_recipient(referral, options={})
    setup_instance_variables(referral)
    template_name = compute_template_name referral, __method__, options
    mail(
      to: @referral.recipient_email,
      subject: "#{@sender.full_name} thought you'd be interested in NewLiving",
      from: "#{@sender.full_name} <#{@referral.sender_email}>"
        ) do |format|
      format.text { render template_name }
      format.html { render template_name }
    end
  end

  private

  def compute_template_name referral, method_name, options
    client_template_name = "#{method_name}_#{referral.client.name.gsub(" ", "_").downcase}"
    default_template_name = if lookup_context.exists?("referral_mailer/#{client_template_name}")
      client_template_name
    else
      method_name
    end
    template_name = options[:template] || default_template_name
  end

  def setup_instance_variables referral
    @referral = referral
    @sender = @referral.sender
    @recipient = @referral.recipient
    @product = @referral.product
    @client = @referral.client
  end

end
