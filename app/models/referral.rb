class Referral < ActiveRecord::Base
  # attr_accessible :content, :recipient, :recipient_attributes, :customizations, :customization_ids
  include ActiveModel::ForbiddenAttributesProtection

  belongs_to :sender, class_name: "User", inverse_of: :sent_referrals
  belongs_to :recipient, class_name: "User", inverse_of: :received_referrals
  belongs_to :product, inverse_of: :referrals
  has_and_belongs_to_many :customizations

  belongs_to :referral_batch, inverse_of: :referrals
  has_one :campaign, through: :referral_batch # TODO(syu): does this get cached?
  has_many :incentives, class_name: "IncentiveInstance"

  accepts_nested_attributes_for :recipient

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

  def attach_incentives
    raise "wala"
  end

  def deliver
    if deliverable
      mailgun_send!
      self.delivered_at = Time.now
      true
    else
      false
    end
  end

  def delivered?
    !!delivered_at
  end

 private
  def mailgun_send!
  end

  def deliverable
    valid = sender && sender.emailable? && sender.email_provided? && recipient && recipient.emailable? && !delivered?
    errors[:deliverable] << "sender not emailable" unless sender && sender.emailable?
    errors[:deliverable] << "sender email unconfirmed" unless sender && sender.email_provided?
    errors[:deliverable] << "recipient not emailable" unless recipient && recipient.emailable?
    errors[:deliverable] << "already delivered" if delivered?
    valid
  end

end
