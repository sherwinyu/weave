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
#  other_info :string(255)
#

class UserInfo < ActiveRecord::Base
  attr_accessible :name, :email, :user_id, :uid, :provider, :other_info, :email
  belongs_to :user, inverse_of: :user_infos
end
