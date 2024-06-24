# frozen_string_literal: true

class SystemNotificationMailer < ApplicationMailer
  before_action :set_lead, except: [:new_comment_alert, :group_mail]

  def group_mail
    @mail_template = params[:mail_template]
    mail(to: params[:email], subject: "OpenCSG 开放传神")
  end

  def new_partner_alert
    mail(to: internal_group,
    subject: "#{subject_prefix}: 合作伙伴申请")
  end

  def new_expert_alert
    mail(to: internal_group,
    subject: "#{subject_prefix}: 专家申请")
  end

  def new_customer_alert
    mail(to: internal_group,
    subject: "#{subject_prefix}: 新客户申请")
  end

  def new_comment_alert
    user_email = params[:user_email]
    @comment = Comment.find params[:comment_id]
    repo_type = @comment.commentable.discussionable.class.model_name.singular
    repo_namespace = @comment.commentable.discussionable.owner.name
    repo_name = @comment.commentable.discussionable.name
    @repo_url = "#{asset_host}/#{repo_type}s/#{repo_namespace}/#{repo_name}"
    mail(to: user_email,
    subject: I18n.t('mailer.new_comment'))
  end

  private

  def set_lead
    @lead = Lead.find params[:lead_id]
  end
end
