Weave.CopyController = Ember.ObjectController.extend
  needs: ['product', 'campaign']
  referredItem: (->
    ret = ""
    ret ||= ctrl('product')?.get('name')
    ret ||= "|the referred item|"
  ).property('controllers.product.content', 'controllers.campaign.content', 'controllers.product.content.name')

  clientName: (->
    ret = ""
    ret ||= ctrl('campaign')?.get('client.name')
    ret ||= "|the client name|"
  ).property('controllers.product.content', 'controllers.campaign.content', 'controllers.campaign.client.name')

  introMessage: (->
    ret = ""
    ret ||= ctrl('campaign')?.get('introMessage')
    ret ||= ctrl('campaign')?.get('client.intro_message')
    ret ||= "|intro message|"
  ).property('controllers.product.content', 'controllers.campaign.content', 'controllers.campaign.client.intro_message', 'controllers.campaign.introMessage')

  referralMessage: (->
    ret = ""
    ret ||= ctrl('campaign')?.get('referralMessage')
    ret ||= ctrl('campaign')?.get('client.referral_message')
    ret ||= "|sup friend, you should buy dis|"
  ).property('controllers.product.content', 'controllers.campaign.content', 'controllers.campaign.client.referral_message', 'controllers.campaign.referralMessage')

Weave.ProductController = Ember.ObjectController.extend()
Weave.CampaignController = Ember.ObjectController.extend()
