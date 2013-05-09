describe "utils", ->
  beforeEach ->
    @data =
      recipient:
        name: "sherwin yu"
        age: 21
        alive: true
      money: 55.0

  describe "ajax", ->
    beforeEach -> @ajax = sinon.stub(jQuery, "ajax")
    afterEach -> @ajax.restore()
    describe "defaults", ->
      it "works", ->
        utils.ajax
          url: "walawala/zoots"
          data: @data
        expect(@ajax).toHaveBeenCalledOnce()
        expect(@ajax).toHaveBeenCalledWith
          contentType: "application/json"
          dataType: "json"
          type: 'GET'
          data: JSON.stringify @data
          url: "walawala/zoots"

  describe "post", ->
    beforeEach -> @ajax = sinon.stub(jQuery, "ajax")
    afterEach -> @ajax.restore()

    describe "defaults", ->
      it "works", ->
        utils.post
          url: "walawala/zoots/postin"
          data: @data
        expect(@ajax).toHaveBeenCalledOnce()
        expect(@ajax).toHaveBeenCalledWith
          contentType: "application/json"
          dataType: "json"
          type: 'POST'
          data: JSON.stringify @data
          url: "walawala/zoots/postin"
