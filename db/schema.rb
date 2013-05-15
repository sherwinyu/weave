# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20130515120628) do

  create_table "authorizations", :force => true do |t|
    t.string   "uid"
    t.string   "provider"
    t.integer  "user_id"
    t.string   "oauth_token"
    t.datetime "created_at",  :null => false
    t.datetime "updated_at",  :null => false
  end

  create_table "campaigns", :force => true do |t|
    t.string   "name"
    t.string   "description"
    t.string   "outreach_email_content"
    t.string   "sender_page_content"
    t.string   "recipient_page_content"
    t.boolean  "live"
    t.datetime "created_at",             :null => false
    t.datetime "updated_at",             :null => false
    t.integer  "product_id"
  end

  create_table "campaigns_recipient_incentives", :id => false, :force => true do |t|
    t.integer "campaign_id"
    t.integer "incentive_id"
  end

  create_table "campaigns_sender_incentives", :id => false, :force => true do |t|
    t.integer "campaign_id"
    t.integer "incentive_id"
  end

  create_table "customizations", :force => true do |t|
    t.string   "description"
    t.integer  "product_id"
    t.datetime "created_at",  :null => false
    t.datetime "updated_at",  :null => false
  end

  create_table "customizations_referrals", :id => false, :force => true do |t|
    t.integer "customization_id"
    t.integer "referral_id"
  end

  create_table "customizations_segments", :id => false, :force => true do |t|
    t.integer "customization_id"
    t.integer "segment_id"
  end

  create_table "incentive_instances", :force => true do |t|
    t.string   "code"
    t.boolean  "claimed",           :default => false
    t.datetime "claimed_at"
    t.datetime "expiration"
    t.boolean  "for_sender",        :default => false
    t.boolean  "for_recipient",     :default => false
    t.datetime "created_at",                           :null => false
    t.datetime "updated_at",                           :null => false
    t.integer  "user_id",                              :null => false
    t.integer  "referral_id"
    t.integer  "referral_batch_id"
    t.integer  "incentive_id"
  end

  create_table "incentives", :force => true do |t|
    t.string   "amount"
    t.string   "name"
    t.string   "description"
    t.string   "condition"
    t.boolean  "free"
    t.datetime "created_at",  :null => false
    t.datetime "updated_at",  :null => false
  end

  create_table "products", :force => true do |t|
    t.string   "name"
    t.string   "description"
    t.integer  "client_id"
    t.datetime "created_at",  :null => false
    t.datetime "updated_at",  :null => false
  end

  create_table "products_segments", :id => false, :force => true do |t|
    t.integer "product_id"
    t.integer "segment_id"
  end

  create_table "referral_batches", :force => true do |t|
    t.boolean  "sender_page_visited"
    t.boolean  "sender_page_personalized"
    t.boolean  "outreach_email_sent"
    t.datetime "created_at",               :null => false
    t.datetime "updated_at",               :null => false
    t.integer  "campaign_id"
    t.integer  "sender_id"
    t.string   "url_code"
    t.datetime "sender_page_visited_at"
  end

  create_table "referrals", :force => true do |t|
    t.string   "message"
    t.datetime "created_at",                             :null => false
    t.datetime "updated_at",                             :null => false
    t.integer  "recipient_id"
    t.integer  "sender_id"
    t.integer  "product_id"
    t.boolean  "delivered",           :default => false
    t.datetime "delivered_at"
    t.boolean  "recipient_opened"
    t.datetime "recipient_opened_at"
    t.boolean  "converted"
    t.integer  "referral_batch_id"
    t.string   "url_code"
  end

  create_table "segments", :force => true do |t|
    t.string   "description"
    t.datetime "created_at",  :null => false
    t.datetime "updated_at",  :null => false
  end

  create_table "user_infos", :force => true do |t|
    t.string   "email"
    t.integer  "user_id"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
    t.string   "provider"
    t.string   "name"
    t.string   "uid"
    t.string   "other_info"
    t.string   "location"
    t.string   "first_name"
    t.string   "last_name"
  end

  create_table "users", :force => true do |t|
    t.string   "name"
    t.datetime "created_at",                                :null => false
    t.datetime "updated_at",                                :null => false
    t.string   "encrypted_password",     :default => "",    :null => false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          :default => 0
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.boolean  "materialized",           :default => false
    t.boolean  "email_provided"
    t.boolean  "omniauthed"
    t.datetime "visited_at"
    t.string   "email"
  end

  add_index "users", ["reset_password_token"], :name => "index_users_on_reset_password_token", :unique => true

  create_table "walas", :force => true do |t|
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

end
