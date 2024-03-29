module ApplicationHelper
  def json_for (target, options={})
    options[:scope] ||= self
    options[:url_options] ||= url_options
    target.active_model_serializers.new(target, options).to_json
  end
end
