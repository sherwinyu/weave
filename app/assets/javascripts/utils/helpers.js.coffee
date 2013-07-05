_app_ = Weave
_app_.u =
  viewFromId: (id) -> Ember.get("Ember.View.views.#{id}")
  viewFromElement: (ele) -> _app_.u.viewFromId($(ele).first().attr('id'))
  viewFromNumber: (num) -> _app_.u.viewFromId("ember#{num}")
  currentPath: -> _app_.__container__.lookup('controller:application').currentPath
_app_.vfi = _app_.u.viewFromId
_app_.vfe = _app_.u.viewFromElement
_app_.vf = _app_.u.viewFromNumber
_app_.lu = (str) ->
  _app_.__container__.lookup str

window.lu = _app_.lu
window.vf = _app_.vf
window.cp = _app_.u.currentPath
window.rt = -> _app_.lu "router:main"
window.ctrl = (name) -> _app_.lu "controller:#{name}"
window.routes = -> _app_.Router.router.recognizer.names
window.msm = (model)-> model.get('stateManager')
window.mcp = (model)-> msm(model).get('currentPath')
window.mcs = (model)-> msm(model).get('currentState')

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

  delete: (opts) ->
    $.extend true, opts, data: {"_method": 'delete'}
    defaults =
      headers:
        "X-Http-Method-Override": "delete"
      type: 'post'
    $.extend defaults, opts
    @ajax defaults

  delayed: (ms, callback) ->
    setTimeout(callback, ms)
