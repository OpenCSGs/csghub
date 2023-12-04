class InternalApi::CommentsController < ApplicationController
  def create
    commentable = find_commentable
    comment = commentable.comments.build(comment_params)
    comment.user = current_user

    if comment.save
      render json: comment.as_json_data, status: :created
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
