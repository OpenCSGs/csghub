class Tag < ApplicationRecord
  validates_presence_of :tag_origin, :tag_type, :name
  validates_uniqueness_of :name, scope: :tag_field

  enum :tag_origin, user_created: 'user_created', system: 'system'
  enum :tag_type, task: 'task', framework: 'framework', language: 'language', license: 'license'
  enum :tag_field,
       computer_vision: 'computer_vision',
       natural_language_processing: 'natural_language_processing',
       audio_processing: 'audio_processing',
       multimodal_technology: 'multimodal_technology',
       text_processing: 'text_processing',
       graphics: 'graphics',
       audio: 'audio',
       video: 'video',
       multimodal: 'multimodal',
       scientific_computing: 'scientific_computing'


  has_many :taggings, dependent: :destroy
  has_many :spaces, through: :taggings

  # 在 issue 中查看颜色对应关系：
  # https://git-devops.opencsg.com/product/community/open-portal/-/issues/50#note_1596
  TAG_FIELD_COLOR_MAPPINGS = {
    computer_vision: {color: '#db7a7a', zh_name: '计算机视觉'},
    natural_language_processing: {color: '#7f71de', zh_name: '自然语言处理'},
    audio_processing: {color: '#538f72', zh_name: '语音处理'},
    multimodal_technology: {color: '#e69832', zh_name: '多模态'},
    multimodal: {color: '#e69832', zh_name: '多模态'},
    text_processing: {color: '#ff33cc', zh_name: '文本'},
    graphics: {color: '#0073e6', zh_name: '图像'},
    audio: {color: '#cccc00', zh_name: '音频'},
    video: {color: '#33cccc', zh_name: '视频'},
    scientific_computing: {color: '#33cc33', zh_name: '科学计算'}
  }

  DEFAULT_TAGS = [
    {name: '语言模型', color: '#009933'},
    {name: '图片模型', color: '#ff9900'},
    {name: '多模态', color: '#cc0066'},
    {name: '智能体', color: '#cc33ff'}
  ]

  def as_json options = nil
    {
      name: name,
      zh_name: zh_name
      }
  end
end
