class CampaignSerializer < ActiveModel::Serializer
  embed :ids, include: true
  attributes :id, :name, :description, :sender_page_content, :recipient_page_content
  has_one :product 
  has_many :sender_incentives, embed: :objects
  has_many :recipient_incentives, embed: :objects

  def include_senders?
    false
  end
  def include_referrals?
    false
  end
end
