class Referral < ActiveRecord::Base
  attr_accessible :content
  def self.mail_gun_test

  end
  def send_complex_message
    data = Multimap.new
    data[:from] = "Excited User <me@samples.mailgun.org>"
    data[:to] = "fouders@communificiency.com"
    # data[:cc] = "serobnic@mail.ru"
    # data[:bcc] = "sergeyo@profista.com"
    data[:subject] = "Hello"
    data[:text] = "Testing some Mailgun awesomness!"
    data[:html] = "<html>HTML version of the body</html>"
    # data[:attachment] = File.new(File.join("files", "test.jpg"))
    # data[:attachment] = File.new(File.join("files", "test.txt"))
    # RestClient.post "https://api:key-3ax6xnjp29jd6fds4gc373sgvjxteol0"\
    # "@api.mailgun.net/v2/samples.mailgun.org/messages", data

    url = "https://api:#{ENV["MAILGUN_API_KEY"]}@api.mailgun.net/v2/#{Figaro.env.mailgun_api_domain}/messages"
    puts url
    binding.pry
    RestClient.post url, data
    # https://api.mailgun.net/v2
  end
end
