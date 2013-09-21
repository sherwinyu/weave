Weave.CopyController = Ember.ObjectController.extend
  needs: ['product', 'campaign']
  referredItem: (->
    ret = ""
    ret ||= ctrl('product')?.get('name')
    ret ||= "|the referred item|"
  ).property('controllers.product.content', 'controllers.campaign.content', 'controllers.product.content.name')

  tellYourFriendsAboutReferredItem: (->
    ret = @get('referredItem')
    referTag = /^Tell a friend about/
    if referTag.test ret
      ret = ret.replace referTag, ""
    ret
  ).property('controllers.product.content', 'controllers.campaign.content', 'controllers.product.content.name')

  clientName: (->
    ret = ""
    ret ||= ctrl('campaign')?.get('client.name')
    ret ||= "|the client name|"
  ).property('controllers.product.content', 'controllers.campaign.content', 'controllers.campaign.client.name')

  client_sunpro:
    (->
      Weave.rails.vars.client.key == 'sunpro'
    ).property('controllers.campaign.client')

  client_newliving:
    (->
      Weave.rails.vars.client.key == 'newliving'
    ).property('controllers.campaign.client')

  client_1bog:
    (->
      Weave.rails.vars.client.key == '1bog'
    ).property('controllers.campaign.client')


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

  logoUrl: (->
    key = Weave.rails.vars.client.logoUrl
  ).property('')

Weave.ProductController = Ember.ObjectController.extend()
Weave.CampaignController = Ember.ObjectController.extend()
