class AddUiCopyToCampaign < ActiveRecord::Migration
  def change
    add_column :campaigns, :referral_message, :string
    add_column :campaigns, :intro_message, :string
    add_column :clients, :referral_message, :string
    add_column :clients, :intro_message, :string

    client = Client.find_by_name "New Living"
    if client
      logger.info "Adding UI Copy to campaign: found a client named New Living: #{client}"
      client.update_attribute referral_message: "I just shopped at New Living, a mission-driven Certified Benefit Corporation that has made a commitment to measure success on a social, environmental and economic level. I know you care a lot about where you shop, so I thought I'd let you know about New Living."
      client.update_attribute intro_message: "Tell your friends about New Living's socially responsible products. Get a $50 Whole Foods Gift Card!"
    end
  end
end
