class LeadFormsController < ApplicationController
  before_action :authenticate_user, except: [:thank_you, :show_form]
  before_action :remember_lead_form, except: [:thank_you]
  before_action :init_lead, except: [:thank_you]
  before_action :set_lead_form, only: [:show, :edit, :update, :toggle_lead_form_status]

  def new
    @lead_form = LeadForm.new
    @lead_form.lead_status = 'Raw'
  end

  def create
    lead_form = LeadForm.new lead_form_params
    if lead_form.save
      redirect_to lead_form_path(lead_form)
    else
      flash[:alert] = '创建失败，请检查提交信息'
      render 'new'
    end
  end

  def show
  end

  def show_form
    uuid = params[:uuid].split('_').first
    @lead_form = LeadForm.find_by!(uuid: uuid)
    if @lead_form.inactive?
      flash[:alert] = '活动已经下线'
    end
    render layout: "lead_form"
  end

  def index
    @lead_forms = LeadForm.order(created_at: 'desc').page params[:page]
  end

  def edit
  end

  def update
    @lead_form.update lead_form_params
    saved_changes = @lead_form.saved_changes.except(:updated_at, :created_at)
    redirect_to lead_form_path(@lead_form)
  end

  def thank_you
    render layout: "lead_form_form"
  end

  def toggle_lead_form_status
    @lead_form.toggle_lead_form_status!
    saved_changes = @lead_form.saved_changes.except(:updated_at, :created_at)
    redirect_to lead_form_path(@lead_form)
  end

  private

  def init_lead
    @lead = Lead.new
    # 这四个信息在 LeadForm 创建的时候是不会配置的，因为一个 LeadForm 可能会用到多个地方
    @lead.utm_content = params['utm_content']
    @lead.utm_medium = params['utm_medium']
    @lead.utm_source = params['utm_source']
    @lead.utm_keyword = params['utm_keyword']
  end

  def remember_lead_form
    session[:original_request_path] = request.fullpath
  end

  def lead_form_params
    params.permit(:title, :internal_title, :description, :lead_source, :channel, :lead_status, lead_fields: [], custom_required_fields: [])
  end

  def set_lead_form
    @lead_form = LeadForm.find params[:id]
  end
end
