class ExpertsController < ApplicationController
  def index

    # 加载experts.yml文件
    experts_data = YAML.load_file("#{Rails.root}/config/experts.yml")
    # 将数据传递给视图
    @experts = EXPERTS
  end
end