class ReferralMailer < ActionMailer::Base

  def sender_to_recipient(referral)
    @referral = referral
    @sender = referral.sender
    @recipient = referral.recipient
    @product = referral.product
    @client = "New Living"
    mail(
      to: @referral.recipient_email,
      subject: "#{@sender.full_name} thought you'd be interested in NewLiving",
      from: "#{@sender.full_name} <#{@referral.sender_email}>"
        ) do |format|
      format.text
      format.html
    end
  end

  def self.deliver( referral )
    data = Multimap.new
    mail = ReferralMailer.sender_to_recipient(referral)
    data[:from] = mail.from # "Excited User <me@samples.mailgun.org>"
    data[:to] = mail.to #"fouders@communificiency.com"
    # data[:cc] = "serobnic@mail.ru"
    # data[:bcc] = "sergeyo@profista.com"
    data[:subject] = mail.subject #"Hello"
    data[:text] = mail.text_part.body # "Testing some Mailgun awesomness!"
    data[:html] = mail.html_part.body # "<html>HTML version of the body</html>"
    data['o:testmode'] = true
    # data[:attachment] = File.new(File.join("files", "test.jpg"))
    # data[:attachment] = File.new(File.join("files", "test.txt"))
    # RestClient.post "https://api:key-3ax6xnjp29jd6fds4gc373sgvjxteol0"\
    # "@api.mailgun.net/v2/samples.mailgun.org/messages", data
    url = "https://api:#{Figaro.env.MAILGUN_API_KEY}@api.mailgun.net/v2/#{Figaro.env.mailgun_api_domain}/messages"
    puts url, data.inspect
    # binding.pry
    RestClient.post url, data
  end

end
