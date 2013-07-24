Weave.CopyController = Ember.ObjectController.extend
  needs: ['product', 'campaign']
  referredItem: (->
    ret = ""
    ret ||= ctrl('product')?.get('name')
    ret ||= "|the referred item|"
  ).property('controllers.product.content', 'controllers.campaign.content')

  clientName: (->
    ret = ""
    ret ||= ctrl('campaign')?.get('client.name')
    ret ||= "|the client name|"
  ).property('controllers.product.content', 'controllers.campaign.content')

  introMessage: (->
    ret = ""
    ret ||= ctrl('campaign')?.get('introMessage')
    ret ||= ctrl('campaign')?.get('client.intro_message')
    ret ||= "|AYO|"
  ).property('controllers.product.content', 'controllers.campaign.content')

  referralMessage: (->
    ret = ""
    ret ||= ctrl('campaign')?.get('referralMessage')
    ret ||= ctrl('campaign')?.get('client.referral_message')
    ret ||= "|sup friend, you should buy dis|"
  ).property('controllers.product.content', 'controllers.campaign.content')

Weave.ProductController = Ember.ObjectController.extend()
Weave.CampaignController = Ember.ObjectController.extend()
