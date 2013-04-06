class CreateReferrals < ActiveRecord::Migration
  def change
    create_table :referrals do |t|
      t.string :content

      t.timestamps
    end
  end
end
