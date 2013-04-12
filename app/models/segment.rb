class Segment < ActiveRecord::Base
  attr_accessible :description
  has_and_belongs_to_many :products
  has_and_belongs_to_many :customizations
end
