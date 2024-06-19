class FinetuneController < ApplicationController
  layout 'repo_application'

  include LocalRepoValidation

  before_action :authenticate_user
  before_action :check_user_info_integrity
  before_action :load_finetune_detail, except: :new

  def new
  end

  def show
    @default_tab = 'summary'
  end

  def logs
    @default_tab = 'logs'
    render :show
  end

  def settings
    @default_tab = 'settings'
    render :show
  end

  private

  def load_finetune_detail
    # 这里后台接口中 namespace 需要是模型的
    namespace = @local_finetune.model_path.split('/')[0]
    model_name = @local_finetune.model_path.split('/')[1]
    @settings_visibility = current_user ? current_user.can_manage?(@local_finetune) : false
  end
end
