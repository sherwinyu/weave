Weave.CopyController = Ember.ObjectController.extend
  referredItem: (->
    ret = ""
    ret ||= ctrl('product')?.get('name')
    ret ||= "|the referred item|"
  ).property()

  clientName: (->
    ret = ""
    ret ||= ctrl('campaign')?.get('client.name')
    ret ||= "|the client name|"
  ).property()

  introMessage: (->
    ret = ""
    ret ||= ctrl('campaign')?.get('introMessage')
    ret ||= ctrl('campaign')?.get('client.intro_message')
    ret ||= "|AYO|"
  ).property()

  referralMessage: (->
    ret = ""
    ret ||= ctrl('campaign')?.get('referralMessage')
    ret ||= ctrl('campaign')?.get('client.referral_message')
    ret ||= "|sup friend, you should buy dis|"
  ).property()

