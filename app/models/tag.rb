class Tag < ApplicationRecord
  validates_presence_of :tag_origin, :tag_type, :name
  validates_uniqueness_of :name, scope: :tag_field

  enum :tag_origin, user_created: 'user_created', system: 'system'
  enum :tag_type, task: 'task', framework: 'framework', language: 'language', license: 'license'
  enum :tag_field,
       computer_vision: 'computer_vision',
       natural_language_processing: 'natural_language_processing',
       video_processing: 'video_processing',
       multimodal_technology: 'multimodal_technology',
       text_processing: 'text_processing',
       graphics: 'graphics',
       audio: 'audio',
       video: 'video',
       multimodal: 'multimodal',
       scientific_computing: 'scientific_computing'


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
