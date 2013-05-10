# == Schema Information
#
# Table name: products
#
#  id          :integer          not null, primary key
#  name        :string(255)
#  description :string(255)
#  client_id   :integer
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#

class Product < ActiveRecord::Base
  attr_accessible :client_id, :description, :name
  has_many :referrals, inverse_of: :product
  has_many :customizations, inverse_of: :product
  has_many :campaigns, inverse_of: :product
  has_and_belongs_to_many :segments
end
