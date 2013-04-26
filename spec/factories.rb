FactoryGirl.define do
  factory :user do |user|
    user.name "sherwin"
    user.sequence(:email) { |n| "email#{n}@example.org" }
    user.password "somepassword"
    user.password_confirmation "somepassword"
  end

  factory :authorization do
    provider "facebook"
    sequence(:uid) { |n| "facebook_id_#{n}" }
    user
  end
end
