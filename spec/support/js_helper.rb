module JsHelper
  def ex script
    page.evaluate_script "console.log(#{script})"
  end
  def jx script
    ex "JSON.stringify(#{script})"
  end
end
RSpec.configure do |config|
  config.include JsHelper, type: :feature
end
