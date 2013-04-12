class Customization < ActiveRecord::Base
  attr_accessible :content, :product_id
  has_and_belongs_to_many :referrals
  has_and_belongs_to_many :segments
  belongs_to :product, inverse_of: :customizations
end
