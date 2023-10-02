class Tag < ApplicationRecord
  has_many :taggings, dependent: :destroy
  has_many :spaces, through: :taggings

  DEFAULT_TAGS = [
    {name: '语言模型', color: '#009933'},
    {name: '图片模型', color: '#ff9900'},
    {name: '多模态', color: '#cc0066'},
    {name: '智能体', color: '#cc33ff'}
  ]

  def as_json options = nil
    {
      name: name,
      color: color
    }
  end
end
