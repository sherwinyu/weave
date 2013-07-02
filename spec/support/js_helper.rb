module JsHelper
  # console.log
  def clog script
    page.evaluate_script "console.log(#{script})"
  end

  # evaluate
  def ev script
    page.evaluate_script script
  end

  # does a console.log and then returns the value
  def peek script
    ret = ev "poltergeist_return_val = #{script}"
    clog "poltergeist_return_val"
    ev "poltergeist_return_val = 'DONTUSEME'"
    ret
  end

  def jsn script
    ev "JSON.stringify(#{script})"
  end
  def jsn script
    ex "JSON.stringify(#{script}}"
  end
end
RSpec.configure do |config|
  config.include JsHelper, type: :feature
end
