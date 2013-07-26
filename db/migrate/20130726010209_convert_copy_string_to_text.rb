class ConvertCopyStringToText < ActiveRecord::Migration
  def change
    change_table "campaigns" do |t|
      t.change "referral_message", :text
      t.change "intro_message", :text
    end
    change_table "clients" do |t|
      t.change "referral_message", :text
      t.change "intro_message", :text
    end
  end
end
