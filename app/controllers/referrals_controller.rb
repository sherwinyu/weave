class ReferralsController < ApplicationController

  def create
    @referral = Referral.new
    case meta_action
    when "create_with_recipient"
      create_with_recipient
    when "create_with_body"
      create_with_body
    else

    end
    @referral.attributes = @attributes
    if @valid && @referral.save
      render json: @referral
    else
      logger.debug "validation error: #{@referral.try(:errors).to_a}"
      render json: @referral, status: 422
    end
  end

  def create_with_recipient
    @referral.status = Referral.STATUSES[:recipient_selected]
    @attributes = referral_params.slice(:recipient_attributes,
                                        :referral_batch_id,
                                        :sender_id,
                                        :sender_email)
    @valid = true # TODO(syu)
  end

  def update
    @referral = Referral.find(params[:id])

    case meta_action
    when "update_body_and_deliver"
      update_body_and_deliver
    when "update_message"
      update_message
    when "update_sender_email"
      update_sender_email
    end
    @referral.attributes = @attributes
    if @valid && @referral.save
      render json: @referral
    else
      logger.debug "validation error: #{@referral.try(:errors).to_a}"
      render json: @referral, status: 422
    end
  end

  def update_body_and_deliver
    @referral.status = Referral.STATUSES[:attempting_delivery]
    required_attributes = [:message, :recipient_email]
    @attributes = referral_params.slice(*required_attributes)

    # We need to set recipient_email explicitly to pass the .deliverable? validation in @referral.deliver
    # TODO(syu): test this
    @referral.recipient_email =  @attributes[:recipient_email]
    @referral.customization_ids =  referral_params[:customization_ids]
    @referral.message =  @attributes[:message]
    @referral.recipient.email = referral_params["recipient_attributes"][:email]
    logger.warn "referral.recipient_email (#{@referral.recipient_email}) and referral.recipient.email (#{@referral.recipient.email}) mismatch!" if @referral.recipient.email != @referral.recipient_email
    @valid = (required_attributes.map(&:to_s) - @attributes.keys).empty? && @referral.deliver
  end

  def update_body
    @referral = Referral.find(params[:id])
    if @referral.update_attributes referral_params
      render json: @referral
    else
      render json: @referral.errors, status: :unprocessable_entity
    end
  end

  def deliver
    @referral = Referral.find(params[:id])
    if @referral.deliver
      render json: @referral
    else
      raise "delivery failed"
    end
  end

  def add_recipient_email
    @referral = Referral.find(params[:id])
    raise "referral is missing recipient" unless @referral.recipient
    if @referral.update_attributes referral_params
      render json: @referral
    else
      raise "invalid"
    end
  end

  def show
    @referral = Referral.find params[:id]
    render json: @referral
  end

  def meta_params
    @meta ||= (params[:referral].delete(:meta) || {} )
  end
  def meta_action
    meta_params[:action]
  end
  def referral_params
    meta_params
    params[:referral][:customization_ids] = params[:referral].delete(:customizations_attributes).map{|c| c[:id]} if params[:referral][:customizations_attributes]
=begin
    if params[:referral][:recipient]
      params[:referral][:recipient_attributes]  =  params[:referral].delete(:recipient)
      params[:referral][:recipient_attributes].slice!(:id, :email) if params[:referral][:recipient_attributes]
    end
=end
    params.require(:referral).permit :message, :referral_batch_id,
      { customization_ids: []},
      :sender_id,
      :recipient_email,
      :sender_email,
      { meta: [:action]},
      { recipient_attributes: [:name,
                               :id,
                               :email,
                               {user_infos_attributes: [:name, :email, :provider, :uid]}]
    }
  end
end
