Weave.u =
  viewFromId: (id) -> Ember.get("Ember.View.views.#{id}")
  viewFromElement: (ele) -> Weave.u.viewFromId($(ele).first().attr('id'))
  viewFromNumber: (num) -> Weave.u.viewFromId("ember#{num}")
  currentPath: -> Weave.__container__.lookup('controller:application').currentPath
Weave.vfi = Weave.u.viewFromId
Weave.vfe = Weave.u.viewFromElement
Weave.vf = Weave.u.viewFromNumber
Weave.lu = (str) ->
  Weave.__container__.lookup str

window.vf = Weave.vf
window.cp = Weave.u.currentPath
window.rt = -> Weave.lu "router:main"
window.ctrl = (name) -> Weave.lu "controller:#{name}"
window.routes = -> App.Router.router.recognizer.names

window.utils =
  # expects: URL, data
  ajax: (opts) ->
    opts.data = JSON.stringify opts.data
    defaults =
      contentType: "application/json"
      dataType: "json"
      type: 'GET'
    $.extend defaults, opts
    $.ajax defaults

  put: (opts) ->
    $.extend true, opts, data: {"_method": 'put'}
    # opts.data = JSON.stringify opts.data
    defaults =
      headers:
        "X-Http-Method-Override": "put"
      type: 'post'
    $.extend defaults, opts
    @ajax defaults

  post: (opts) ->
    # opts.data = JSON.stringify opts.data
    defaults =
      type: 'POST'
    $.extend defaults, opts
    @ajax defaults

