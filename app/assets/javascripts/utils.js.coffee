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
