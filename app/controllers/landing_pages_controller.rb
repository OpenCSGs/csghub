class LandingPagesController < ApplicationController
  before_action :authenticate_user, except: [:thank_you, :show_form]
  before_action :remember_landing_page, except: [:thank_you]
  before_action :init_lead, except: [:thank_you]
  before_action :set_landing_page, only: [:show, :edit, :update, :toggle_landing_page_status]

  def new
    @landing_page = LandingPage.new
    @landing_page.lead_status = 'Raw'
  end

  def create
    landing_page = LandingPage.new landing_page_params
    if landing_page.save
      redirect_to landing_page_path(landing_page)
    else
      flash[:alert] = '创建失败，请检查提交信息'
      render 'new'
    end
  end

  def show
  end

  def show_form
    uuid = params[:uuid].split('_').first
    @landing_page = LandingPage.find_by!(uuid: uuid)
    if @landing_page.inactive?
      flash[:alert] = '活动已经下线'
    end
    render layout: "landing_page_form"
  end

  def index
    @landing_pages = LandingPage.order(created_at: 'desc').page params[:page]
  end

  def edit
  end

  def update
    @landing_page.update landing_page_params
    saved_changes = @landing_page.saved_changes.except(:updated_at, :created_at)
    redirect_to landing_page_path(@landing_page)
  end

  def thank_you
    render layout: "landing_page_form"
  end

  def toggle_landing_page_status
    @landing_page.toggle_landing_page_status!
    saved_changes = @landing_page.saved_changes.except(:updated_at, :created_at)
    redirect_to landing_page_path(@landing_page)
  end

  private

  def init_lead
    @lead = Lead.new
    # 这四个信息在 Landing Page 创建的时候是不会配置的，因为一个 Landing Page 可能会用到多个地方
    @lead.utm_content = params['utm_content']
    @lead.utm_medium = params['utm_medium']
    @lead.utm_source = params['utm_source']
    @lead.utm_keyword = params['utm_keyword']
  end

  def remember_landing_page
    session[:original_request_path] = request.fullpath
  end

  def landing_page_params
    params.permit(:title, :internal_title, :description, :lead_source, :channel, :lead_status, lead_fields: [], custom_required_fields: [])
  end

  def set_landing_page
    @landing_page = LandingPage.find params[:id]
  end
end
