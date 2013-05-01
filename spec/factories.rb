FactoryGirl.define do
  sequence(:random_string) {|n| "wala#{n}" }
  sequence(:number) {|n| n }

  factory :user do |user|
    user.name "sherwin"
    user.sequence(:email) { |n| "email#{n}@example.org" }
    user.password "somepassword"
    user.password_confirmation "somepassword"
    user.materialized false
    
    trait(:materialized) { materialized true }
    factory :sender do |sender|
      sender.name "sherwinthe sender"
    end
  end

  factory :authorization do
    provider "facebook"
    sequence(:uid) { |n| "facebook_id_#{n}" }
    user
  end
  factory :referral_batch do |rb|
    rb.sender { create :user, name: "sherwin the sender" }
    association :campaign, :with_customizations
    # rb.campaign {  :with_customizations }
  end

  factory :campaign do |campaign|
    name "No incentives"
    description "Testing whether people will refer based on good will"
    outreach_email_content ""
    sender_page_content ""
    recipient_page_content ""
    trait :with_customizations do
      association :product, :with_customizations 
    end

  end

  factory :product do |product|
    name "Nest Thermostat"
    description "thermostat up yo ass"

    trait :with_customizations do
      after :create  do |product|
        create_list :customization, 3, product: product
      end
    end
  end

  factory :customization do |customization|
    content { "#{generate :random_string} this product is perfect for the tech savvy asshole! totally rad!" }
  end

end
