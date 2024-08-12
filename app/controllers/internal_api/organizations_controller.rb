class InternalApi::OrganizationsController < InternalApi::ApplicationController
  # Todo: remove later
  # before_action :authenticate_user, except: [:models, :datasets, :codes, :spaces]
  # before_action :set_org, only: [:update, :members, :remove_member, :update_member]
  # before_action :set_user, only: [:remove_member, :update_member]

  # def create
  #   new_org = Organization.new organization_params
  #   new_org.creator = current_user
  #   Organization.transaction do
  #     new_org.save!
  #     OrgMembership.create!(organization: new_org, user: current_user, role: :admin)
  #   end
  #   render json: {message: '组织创建成功!'}, status: 200
  # rescue => error
  #   message = new_org.errors.full_messages.to_sentence
  #   message = message.presence || error.message
  #   render json: {message: message}, status: 500
  # end

  # def update
  #   authorize @org

  #   # 更新组织的信息
  #   @org.assign_attributes(organization_params)

  #   # 保存组织信息
  #   if @org.save
  #     render json: {message: '组织更新成功'}
  #   else
  #     render json: {message: "组织更新失败"}, status: 500
  #   end
  # rescue Pundit::NotAuthorizedError
  #   render json: {message: '更新未授权!'}, status: 401
  # end

  # def new_members
  #   unless OrgMembership.roles.keys.include? params[:user_role]
  #     return render json: {message: I18n.t('organizaitons.provide_role')}, status: 400
  #   end

  #   user_names = params[:user_names].split(',').map(&:strip)
  #   return render json: {message: I18n.t('organizations.provide_username')}, status: 400 unless user_names.present?

  #   org = Organization.find_by(name: params[:org_name])
  #   return render json: {message: I18n.t('organizations.not_found')}, status: 404 unless org
  #   return render json: {message: I18n.t('organizations.not_authorized')} if current_user.org_role(org) != 'admin'

  #   Organization.transaction do
  #     user_names.each do |user_name|
  #       user = User.find_by(name: user_name)
  #       # 不允许改自己的角色
  #       next if current_user == user
  #       next unless user
  #       user_org_role = user.org_role(org)
  #       if !user_org_role
  #         OrgMembership.create!(organization: org, user: user, role: params[:user_role])
  #         sync_create_membership(org, user)
  #       elsif user_org_role == params[:user_role]
  #         next
  #       else
  #         user.set_org_role(org, params[:user_role])
  #         sync_update_membership(org, user, params[:user_role], user_org_role)
  #       end
  #     end
  #   end
  #   render json: {message: I18n.t('organizations.add_member_success')}
  # rescue => e
  #   render json: {message: "#{I18n.t('organizations.add_member_failed')}, #{e.message}"}, status: 400
  # end

  # def models
  #   render json: csghub_api.get_org_models(params[:namespace], current_user&.name, { per: params[:per] })
  # end

  # def datasets
  #   render json: csghub_api.get_org_datasets(params[:namespace], current_user&.name, { per: params[:per] })
  # end

  # def spaces
  #   render json: csghub_api.get_org_application_spaces(params[:namespace], current_user&.name, { per: params[:per] })
  # end

  # def codes
  #   render json: csghub_api.get_org_codes(params[:namespace], current_user&.name, { per: params[:per] })
  # end

  # def members
  #   authorize @org

  #   users = @org.users.order(id: :desc).page(params[:page]).per(params[:per] || 8)

  #   members = users.map do |user|
  #     user.as_json.merge(role: user.org_role(@org))
  #   end
  #   render json: { members: members.as_json, total_count: users.total_count}
  # end

  # def remove_member
  #   authorize @org
  #   return render json: {message: '不能删除自己'}, status: 400 if current_user == @user

  #   if @org.is_last_admin?(@user)
  #     return render json: {message: '不能删除组织最后一个管理员！'}, status: 400
  #   end

  #   user_org_role = @user.org_role(@org)

  #   Organization.transaction do
  #     @user.org_membership_by_org(@org).destroy
  #     sync_delete_membership(@org, @user, user_org_role)
  #   end
  #   render json: {message: '删除组织成员成功'}
  # rescue => e
  #   render json: {message: "删除组织成员失败, #{e.message}"}, status: 400
  # end

  # def update_member
  #   authorize @org

  #   unless OrgMembership.roles.keys.include? params[:user_role]
  #     return render json: {message: '请提供角色信息'}, status: 400
  #   end

  #   if @org.is_last_admin?(@user) && params[:user_role] != 'admin'
  #     return render json: {message: '不能修改组织最后一个管理员的权限！'}, status: 400
  #   end

  #   old_role = @user.org_role @org

  #   Organization.transaction do
  #     @user.set_org_role(@org, params[:user_role])
  #     sync_update_membership(@org, @user, params[:user_role], old_role)
  #   end
  #   render json: {message: '更新组织成员成功'}
  # rescue => e
  #   render json: {message: "更新组织成员失败, #{e.message}"}, status: 400
  # end

  # private

  # def organization_params
  #   params.permit(:name, :nickname, :homepage, :org_type, :logo)
  # end

  # def sync_create_membership(org, user)
  #   res = csghub_api.create_membership(org.name, current_user.name, params[:user_role], user.name)
  #   raise StarhubError, res.body unless res.success?
  # end

  # def sync_delete_membership(org, user, role)
  #   res = csghub_api.delete_membership(org.name, current_user.name, role, user.name)
  #   raise StarhubError, res.body unless res.success?
  # end

  # def sync_update_membership(org, user, new_role, old_role)
  #   res = Starhub.api.update_membership(org.name, current_user.name, new_role, old_role, user.name)
  #   raise StarhubError, res.body unless res.success?
  # end

  # def set_org
  #   @org = Organization.find_by(name: params[:id])
  #   return render json: {message: '未找到组织'}, status: 404 unless @org
  # end

  # def set_user
  #   @user = User.find_by(id: params[:user_id])
  #   return render json: {message: '未找到用户'}, status: 404 unless @user
  # end
end
