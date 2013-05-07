Weave.u =
  viewFromId: (id) -> Ember.get("Ember.View.views.#{id}")
  viewFromElement: (ele) -> Weave.u.viewFromId($(ele).first().attr('id'))
  viewFromNumber: (num) -> Weave.u.viewFromId("ember#{num}")
  currentPath: -> Weave.__container__.lookup('controller:application').currentPath
Weave.vfi = Weave.u.viewFromId
Weave.vfe = Weave.u.viewFromElement
Weave.vf = Weave.u.viewFromNumber

window.vf = Weave.vf
window.cP = Weave.u.currentPath


window.utils =
  ajax: (opts) ->
    defaults =
      contentType: "application/json"
      dataType: "json"
      type: 'GET'
    $.extend defaults, opts
    $.ajax defaults

  put: (opts) ->
    $.extend true, opts, data: {"_method": 'put'}
    opts.data = JSON.stringify opts.data
    defaults =
      headers:
        "X-Http-Method-Override": "put"
      contentType: "application/json"
      dataType: "json"
      type: 'post'
    $.extend defaults, opts
    $.ajax defaults

