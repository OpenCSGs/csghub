class Api::CommentsController < Api::ApplicationController
  include ActionView::Helpers::DateHelper

  def create
    commentable = find_commentable
    comment = commentable.comments.build(comment_params)
    comment.user = @current_user

    if comment.save
      comment_data = comment.as_json(only: [:id, :content])
      comment_data["time"] = time_ago_in_words(comment.created_at)
      comment_data["user"] = {
        id: comment.user.id,
        name: comment.user.comment_display_name,
        avatar: comment.user.avatar
      }
      render json: comment_data, status: :created
    else
      render json: comment.errors, status: :unprocessable_entity
    end
  end

  def destroy
    comment = Comment.find_by(id: params[:id])
    return render json: {message: "Comment not found"}, status: :not_found unless comment
    return render json: { message: "Unauthorized" }, status: :unauthorized unless comment.user.id == current_user.id

    if comment.destroy
      render json: {message: "Comment destroyed"}
    else
      render json: {message: "Failed to destroy comment"}, status: :bad_request
    end
  end

  private

  def comment_params
    params.require(:comment).permit(:content)
  end

  def find_commentable
    params[:commentable_type].classify.constantize.find(params[:commentable_id])
  end
end
