Weave.Campaign = DS.Model.extend
  description: DS.attr("string")
  outreach_email_content: DS.attr('string')
  sender_page_content: DS.attr('string')
  recipient_page_content: DS.attr('string')
  live: DS.attr('boolean')
