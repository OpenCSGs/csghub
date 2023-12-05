class InternalApi::OrganizationsController < ApplicationController
  def create
    new_org = Organization.new organization_params
    if params[:logo].present?
      image_url_code = AliyunOss.instance.upload 'org-logo', params[:logo]
      new_org.logo = image_url_code
    end
    Organization.transaction do
      new_org.save!
      OrgMembership.create!(organization: new_org, user: current_user, role: :admin)
    end
    render json: {message: '组织创建成功!'}, status: 200
  rescue => error
    Rails.logger.warn "=====Error=====: #{error.message}"
    render json: {message: '组织创建失败!'}, status: 500
  end

  def update
  end

  private

  def organization_params
    params.permit(:name, :nickname, :homepage, :org_type)
  end
end
