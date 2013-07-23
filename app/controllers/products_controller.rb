class ProductsController < ApplicationController
  def show
    @product = Product.find(params[:id])
    render json: @product
  end
  def index
    @products =  Product.find_all_by_id params[:ids]
    @products = Product.all if @products.empty?
    logger.info "#{@products.inspect}"
    render json: @products
  end
end
