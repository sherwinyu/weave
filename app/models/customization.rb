# == Schema Information
#
# Table name: customizations
#
#  id          :integer          not null, primary key
#  description :text(255)
#  product_id  :integer
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#

class Customization < ActiveRecord::Base
  attr_accessible :description, :product_id
  has_and_belongs_to_many :referrals
  belongs_to :product, inverse_of: :customizations

  has_and_belongs_to_many :segments

end
