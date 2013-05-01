class ReferralBatchSerializer < ActiveModel::Serializer
  embed :ids, include: true

  # attributes :id
  has_many :sent_referrals, embed: :objects
  has_one :campaign #, embed: :id, include: true
  has_one :sender, embed: :ids
  def include_sender?
    false
  end


end
