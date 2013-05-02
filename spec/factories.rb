FactoryGirl.define do
  sequence(:random_string) {|n| "wala#{n}" }
  sequence(:number) {|n| n }

  factory :user do |user|
    user.name "sherwin"
    user.sequence(:email) { |n| "email#{n}@example.org" }
    user.password "somepassword"
    user.password_confirmation "somepassword"
    
    trait(:materialized) { materialized true }
    trait(:not_materialized) { materialized false }

    factory :sender do |sender|
      sender.name "sherwinthe sender"
    end

    factory :recipient do |sender|
      sender.name "sherwin the recipient"
    end

    trait(:with_user_info) do
      after :create  do |user|
        create_list :user_info, 1, user: user
      end
    end
  end

  factory :user_info do
    email { "user_info_email#{generate :number}@example.org" }
  end

  factory :authorization do
    provider "facebook"
    sequence(:uid) { |n| "facebook_id_#{n}" }
    user
  end

  factory :referral_batch do |referral_batch|
    association :sender, factory: :sender
    association :campaign, :with_customizations
  end

  factory :referral do |referral|
    content "you should totally buy this!"
    sender
    recipient
    referral_batch
    trait(:no_content) {content nil}
    trait(:no_sender) {sender nil}
    trait(:no_recipient) {recipient nil}
    factory :blank_referral, traits: [:no_content, :no_sender, :no_recipient]
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
