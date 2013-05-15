class ConvertStringToText < ActiveRecord::Migration
  def change
    change_table "campaigns" do |t|
      t.change "description", :text
      t.change "outreach_email_content", :text
      t.change "sender_page_content", :text
      t.change "recipient_page_content", :text
    end

    change_table "customizations" do |t|
      t.change "description", :text
    end

    change_table "products" do |t|
      t.change "description", :text
    end

    change_table "referrals" do |t|
      t.change "message", :text
    end

    change_table "segments" do |t|
      t.change "description", :text
    end

    change_table "user_infos" do |t|
      t.change "other_info", :text
    end
  end
end
