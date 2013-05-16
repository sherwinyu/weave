# == Schema Information
#
# Table name: segments
#
#  id          :integer          not null, primary key
#  description :text(255)
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#

class Segment < ActiveRecord::Base
  attr_accessible :description
  has_and_belongs_to_many :products
  has_and_belongs_to_many :customizations
end
