require 'rubygems'
# require 'spork'
require 'capybara/rspec'
require 'capybara/poltergeist'
require 'rspec-spies'
#uncomment the following line to use spork with the debugger
#require 'spork/ext/ruby-debug'


###!!
###!!            No spork
###!!           ==========


# This file is copied to spec/ when you run 'rails generate rspec:install'
ENV["RAILS_ENV"] ||= 'test'
require File.expand_path("../../config/environment", __FILE__)
require 'rspec/rails'

# Requires supporting ruby files with custom matchers and macros, etc,
# in spec/support/ and its subdirectories.
Dir[Rails.root.join("spec/support/**/*.rb")].each {|f| require f}

# from https://gist.github.com/rsanheim/1054078

RSpec.configure do |config|
  # == Mock Framework
  #
  # If you prefer to use mocha, flexmock or RR, uncomment the appropriate line:
  #
  # config.mock_with :mocha
  # config.mock_with :flexmock
  # config.mock_with :rr
  config.mock_with :rspec

  # Remove this line if you're not using ActiveRecord or ActiveRecord fixtures
  # config.fixture_path = "#{::Rails.root}/spec/fixtures"

  # If you're not using ActiveRecord, or you'd prefer not to run each of your
  # examples within a transaction, remove the following line or assign false
  # instead of true.
  config.use_transactional_fixtures = true

  # Allows FactoryGirl build, create, etc methods to be called from a global
  # scope (without prefacing with 'FactoryGirl.x')
  config.include FactoryGirl::Syntax::Methods

  # Include devise helpers and controller macros (https://github.com/plataformatec/devise/wiki/How-To%3a-Controllers-and-Views-tests-with-Rails-3-%28and-rspec%29)
  config.include Devise::TestHelpers, :type => :controller
  # config.extend ControllerMacros, :type => :controller

end
# Use poltergeist
Capybara.register_driver :poltergeist_debug do |app|
  Capybara::Poltergeist::Driver.new(app, inspector: true)
end

Capybara.javascript_driver = :poltergeist_debug


# This code will be run each time you run your specs.
FactoryGirl.reload

# https://gist.github.com/mrinterweb/850225
# Devise caches user class so we need to reload it
load File.expand_path(File.dirname(__FILE__) + '/../app/models/user.rb')

# from http://stackoverflow.com/questions/14061325/prepare-called-on-a-closed-database-rails-rspec
# ActiveRecord::Base.establish_connection
# commenting out -- trying to fix rspec transaction issues with zeus
# ActiveRecord::Base.shared_connection = ActiveRecord::Base.connection









=begin
Spork.prefork do
  # Loading more in this block will cause your tests to run faster. However,
  # if you change any configuration or code from libraries loaded here, you'll
  # need to restart spork for it take effect.


  # This file is copied to spec/ when you run 'rails generate rspec:install'
  ENV["RAILS_ENV"] ||= 'test'
  require File.expand_path("../../config/environment", __FILE__)
  require 'rspec/rails'

  # Requires supporting ruby files with custom matchers and macros, etc,
  # in spec/support/ and its subdirectories.
  Dir[Rails.root.join("spec/support/**/*.rb")].each {|f| require f}

  # from https://gist.github.com/rsanheim/1054078
  Spork.trap_method(Rails::Application, :reload_routes!)
  Spork.trap_method(Rails::Application::RoutesReloader, :reload!)

  RSpec.configure do |config|
    # == Mock Framework
    #
    # If you prefer to use mocha, flexmock or RR, uncomment the appropriate line:
    #
    # config.mock_with :mocha
    # config.mock_with :flexmock
    # config.mock_with :rr
    config.mock_with :rspec

    # Remove this line if you're not using ActiveRecord or ActiveRecord fixtures
    # config.fixture_path = "#{::Rails.root}/spec/fixtures"

    # If you're not using ActiveRecord, or you'd prefer not to run each of your
    # examples within a transaction, remove the following line or assign false
    # instead of true.
    config.use_transactional_fixtures = true

    # Allows FactoryGirl build, create, etc methods to be called from a global
    # scope (without prefacing with 'FactoryGirl.x')
    config.include FactoryGirl::Syntax::Methods

    # Include devise helpers and controller macros (https://github.com/plataformatec/devise/wiki/How-To%3a-Controllers-and-Views-tests-with-Rails-3-%28and-rspec%29)
    config.include Devise::TestHelpers, :type => :controller
    # config.extend ControllerMacros, :type => :controller

  end
  # Use poltergeist
  Capybara.register_driver :poltergeist_debug do |app|
    Capybara::Poltergeist::Driver.new(app, inspector: true)
  end

  Capybara.javascript_driver = :poltergeist_debug

end

Spork.each_run do
  # This code will be run each time you run your specs.
  FactoryGirl.reload

  # https://gist.github.com/mrinterweb/850225
  # Devise caches user class so we need to reload it
  load File.expand_path(File.dirname(__FILE__) + '/../app/models/user.rb')

  # from http://stackoverflow.com/questions/14061325/prepare-called-on-a-closed-database-rails-rspec
  # ActiveRecord::Base.establish_connection
  ActiveRecord::Base.shared_connection = ActiveRecord::Base.connection
end
=end

# --- Instructions ---
# Sort the contents of this file into a Spork.prefork and a Spork.each_run
# block.
#
# The Spork.prefork block is run only once when the spork server is started.
# You typically want to place most of your (slow) initializer code in here, in
# particular, require'ing any 3rd-party gems that you don't normally modify
# during development.
#
# The Spork.each_run block is run each time you run your specs.  In case you
# need to load files that tend to change during development, require them here.
# With Rails, your application modules are loaded automatically, so sometimes
# this block can remain empty.
#
# Note: You can modify files loaded *from* the Spork.each_run block without
# restarting the spork server.  However, this file itself will not be reloaded,
# so if you change any of the code inside the each_run block, you still need to
# restart the server.  In general, if you have non-trivial code in this file,
# it's advisable to move it into a separate file so you can easily edit it
# without restarting spork.  (For example, with RSpec, you could move
# non-trivial code into a file spec/support/my_helper.rb, making sure that the
# spec/support/* files are require'd from inside the each_run block.)
#
# Any code that is left outside the two blocks will be run during preforking
# *and* during each_run -- that's probably not what you want.
#
# These instructions should self-destruct in 10 seconds.  If they don't, feel
# free to delete them.
