# == Schema Information
#
# Table name: referrals
#
#  id                  :integer          not null, primary key
#  message             :text(255)
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  recipient_id        :integer
#  sender_id           :integer
#  product_id          :integer
#  delivered           :boolean          default(FALSE)
#  delivered_at        :datetime
#  recipient_opened    :boolean
#  recipient_opened_at :datetime
#  converted           :boolean
#  referral_batch_id   :integer
#  url_code            :string(255)
#

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

  validate :deliverable?
  validates_presence_of :sender

  def self.mail_gun_test

  end

  def attach_incentives
    raise "wala"
  end

  def deliver
    if deliverable?
      mailgun_send
      self.delivered_at = Time.now
      true
    else
      false
    end
  end

  def delivered?
    !!delivered_at
  end

  def deliverable?
    valid = sendable? && receivable? && !delivered?  # sender && sender.emailable? && sender.email_provided? && recipient && recipient.emailable? && !delivered?
    # errors[:sender_email] << "Sender email invalid" unless sender && sender.emailable?
    # errors[:sender_email] << "Sender email unconfirmed" unless sender && sender.email_provided?
    # errors[:recipient_email] << "Recipient needs a valid email" unless recipient && recipient.emailable?
    errors[:deliverable] << "already delivered" if delivered?
    valid
  end

  def sendable?
    # TODO(syu)
    valid = Utils.valid_email? self.sender_email
    errors[:sender_email] << "Sender email invalid" unless valid
    valid
    # || sender && sender.emailable?
    # errors[:sender_email] << "Sender email unconfirmed" unless sender && sender.email_provided?
  end

  def receivable?
    valid = Utils.valid_email? self.recipient_email
    errors[:recipient_email] << "Recipient email invalid" unless valid
    valid
  end

 private
  def mailgun_send
    ReferralMailer.deliver(self)
  end

end
