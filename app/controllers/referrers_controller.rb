class ReferrersController < ApplicationController
  def new
    @me = fb_api.get_object "me"
  end
  def welcome
  end
end
