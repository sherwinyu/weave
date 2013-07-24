class CampaignSerializer < ActiveModel::Serializer
  embed :ids, include: true
  attributes :id, :name, :description, :sender_page_content, :recipient_page_content, :intro_message
  has_one :client, embed: :objects
  # has_many :sender_incentives, embed: :objects
  # has_many :recipient_incentives, embed: :objects

  def include_senders?
    false
  end
  def include_referrals?
    false
  end
  def include_client?
    true
  end
end
