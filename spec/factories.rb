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
      sender.email { "sender_email#{generate :number}@example.org" }
      sender.email_provided true
    end

    factory :recipient do |sender|
      sender.name "sherwin the recipient"
    end

    trait(:visited) { visited_at { Time.now }}
    trait(:without_email) { email nil }
    trait(:email_provided) { email_provided true }
    trait(:with_omniauth) do
      after :create do |user|
        create_list :authorizations, 1, user: user
      end
      omniauthed true
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
    url_code ""
    sender_page_visited_at nil
    sender_page_personalized false
    outreach_email_sent false
    association :sender, factory: :sender
    association :campaign
    sender_email { sender.try(:email) }
    association :product, :with_customizations
    trait(:no_sender){ sender nil }
    trait(:no_product){ product nil }
    trait(:outreach_email_sent){ outreach_email_sent true }
    trait(:sender_page_personalized){ sender_page_personalized true}
  end

  factory :referral do |referral|
    message "you should totally buy this!"
    sender
    recipient
    referral_batch
    # campaign
    sender_email { sender.try(:email) }
    recipient_email { recipient.try(:email) }
    # association :product, :with_customizations
    after :stub do |referral|
      referral.product = referral.referral_batch.product
    end
    after :create do |referral|
      referral.product = referral.referral_batch.product
    end
    callback(:unify_sender_recipent_emails) do |referral|
      referral.sender_email = referral.sender.email
      referral.recipient_email = referral.recipient.email
    end


    trait(:not_delivered) {delivered_at nil}
    trait(:no_message) {message nil}
    trait(:no_sender) {sender nil}
    trait(:no_recipient) {recipient nil}
    trait(:no_recipient_email) {recipient_email nil}
    factory :blank_referral, traits: [:no_message, :no_sender, :no_recipient]
  end

  factory :campaign do |campaign|
    name "No incentives"
    description "Testing whether people will refer based on good will"
    outreach_email_content ""
    sender_page_content ""
    recipient_page_content ""
    client
    trait :with_incentives do
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
    description { "#{generate :random_string} this product is perfect for the tech savvy asshole! totally rad!" }
  end

  factory :client do |client|
    name "New Living"
    key { "newliving#{generate :number}" }
    trait(:with_campaign_referral_batches_and_referrals) {
      after :create do |cli|
        create_list :campaigns, 1, client: cli
      end
    }
    trait(:with_campaigns) do
      campaigns { create_list :campaign, 3 }
    end
  end

end
