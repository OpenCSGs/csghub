class InternalApi::OrganizationsController < ApplicationController
  def create
    new_org = Organization.new organization_params
    if params[:logo].present?
      image_url_code = AliyunOss.instance.upload 'org-logo', params[:logo]
      new_org.logo = image_url_code
    end
    if new_org.save
      render json: {message: '组织创建成功!'}, status: 200
    else
      render json: {message: '组织创建失败!'}, status: 500
    end
  end

  def update
  end

  private

  def organization_params
    params.permit(:name, :nickname, :homepage, :org_type)
  end
end
