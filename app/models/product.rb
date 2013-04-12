class Product < ActiveRecord::Base
  attr_accessible :client_id, :description, :name
  has_many :referrals, inverse_of: :product
  has_many :customizations, inverse_of: :product
  has_and_belongs_to_many :segments
end
