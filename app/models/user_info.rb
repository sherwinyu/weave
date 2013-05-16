# == Schema Information
#
# Table name: user_infos
#
#  id         :integer          not null, primary key
#  email      :string(255)
#  user_id    :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  provider   :string(255)
#  name       :string(255)
#  uid        :string(255)
#  other_info :text(255)
#  location   :string(255)
#  first_name :string(255)
#  last_name  :string(255)
#

class UserInfo < ActiveRecord::Base
  attr_accessible :name, :email, :user_id, :uid, :provider, :other_info, :email, :first_name, :last_name, :location
  belongs_to :user, inverse_of: :user_infos
end
