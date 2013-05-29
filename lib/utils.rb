class Utils
  # TODO(syu): NEEDS TESTING
  def self.valid_email? email
    email.instance_of? String and !!(email && email =~/\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i)
  end
end
