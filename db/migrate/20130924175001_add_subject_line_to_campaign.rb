class AddSubjectLineToCampaign < ActiveRecord::Migration
  def change
    add_column :campaigns, :email_subject, :string
  end
end
