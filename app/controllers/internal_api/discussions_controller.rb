
class InternalApi::DiscussionsController < ApplicationController
  before_action :authenticate_user

  def index
    discussionable = find_discussionable
    discussions = discussionable.discussions

    render json: discussions.as_json, status: :ok
  end

  def create
    discussionable = find_discussionable
    discussion = discussionable.discussions.build(discussion_params)
    discussion.user = current_user

    if discussion.save
      render json: discussion.as_json, status: :created
    else
      render json: discussion.errors, status: :unprocessable_entity
    end
  end

  def update
    discussion = Discussion.find_by(id: params[:id])
    if discussion && discussion.update(discussion_params)
      render json: discussion.as_json, status: :ok
    else
      render json: { message: '更新失败' }, status: :unprocessable_entity
    end
  end

  private

  def discussion_params
    params.permit(:title)
  end

  def find_discussionable
    params[:discussionable_type].classify.constantize.find(params[:discussionable_id])
  end
end
