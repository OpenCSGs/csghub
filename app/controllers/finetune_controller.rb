class FinetuneController < ApplicationController

  before_action :authenticate_user
  before_action :check_user_info_integrity

  def new
  end

  def show
    @namespace = params[:namespace]
    @name = params[:name]
    @finetune_name = params[:finetune_name]
    @finetune_id = params[:finetune_id]
    @path = params[:path]
  end

end
