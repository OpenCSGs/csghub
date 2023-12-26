class InternalApi::OrganizationsController < InternalApi::ApplicationController
  before_action :authenticate_user

  def create
    new_org = Organization.new organization_params
    if params[:logo].present?
      image_url_code = AliyunOss.instance.upload 'org-logo', params[:logo]
      new_org.logo = image_url_code
    end
    new_org.creator = current_user
    Organization.transaction do
      new_org.save!
      OrgMembership.create!(organization: new_org, user: current_user, role: :admin)
    end
    render json: {message: '组织创建成功!'}, status: 200
  rescue => error
    message = new_org.errors.full_messages.to_sentence
    message = message.presence || error.message
    render json: {message: message}, status: 500
  end

  def update
  end

  def new_members
    user_names = params[:user_names].split(',').map(&:strip)
    return render json: {message: '请提供成员信息'}, status: 400 unless user_names.present?

    org = Organization.find_by(name: params[:org_name])
    return render json: {message: '未找到组织'}, status: 400 unless org
    return render json: {message: '未授权，请联系管理员'} if current_user.org_role(org) != 'admin'

    Organization.transaction do
      user_names.each do |user_name|
        user = User.find_by(name: user_name)
        # 不允许改自己的角色
        next if current_user == user
        next unless user
        user_org_role = user.org_role(org)
        if !user_org_role
          OrgMembership.create!(organization: org, user: user, role: params[:user_role])
        elsif user_org_role == params[:user_role]
          next
        else
          user.set_org_role(org, params[:user_role])
        end
      end
    end
    render json: {message: '添加组织成员成功'}
  rescue => e
    render json: {message: "添加组织成员失败, #{e.message}"}, status: 400
  end

  private

  def organization_params
    params.permit(:name, :nickname, :homepage, :org_type)
  end
end
