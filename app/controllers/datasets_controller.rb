class DatasetsController < ApplicationController
  before_action :check_user_info_integrity
  before_action :load_dataset_detail, only: [:show, :files]

  def index
  end

  def show
    @default_tab = 'summary'
    @files = Starhub.api.get_datasets_files(params[:user_name], params[:dataset_name])
  end

  def files
    @default_tab = 'files'
    @current_branch = params[:branch] || 'main'
    @current_path = params[:path] || ''
    @files = Starhub.api.get_datasets_files(params[:user_name], params[:dataset_name], files_options)
    render :show
  end

  def new_index
    response = {}
    Tag::DATASET_TAG_FIELDS.each do |field|
      response[field] = {}
      response[field][:color] = Tag::TAG_FIELD_COLOR_MAPPINGS[field][:color]
      response[field][:zh_name] = Tag::TAG_FIELD_COLOR_MAPPINGS[field][:zh_name]
      response[field][:tags] = Tag.where(tag_field: field)
    end
    @task_tags = response.as_json
    @framework_tags = Tag.where(tag_type: 'framework').as_json
    @license_tags = Tag.where(tag_type: 'license').as_json
  end

  private

  def load_dataset_detail
    @dataset = Starhub.api.get_datasets_detail(params[:user_name], params[:dataset_name])
    @last_commit = Starhub.api.get_datasets_last_commit(params[:user_name], params[:dataset_name])
    @branches = Starhub.api.get_datasets_branches(params[:user_name], params[:dataset_name])
  end

  def files_options
    {
      ref: @current_branch,
      path: @current_path
    }
  end
end
