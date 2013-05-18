class ReferralBatchSerializer < ActiveModel::Serializer
  embed :ids, include: true

  attributes :id
  # has_many :referrals, embed: :objects
  has_one :campaign #, embed: :id, include: true
  has_one :sender, embed: :objects
=begin
  def include_sender?
    object.sender
  end
=end


end
