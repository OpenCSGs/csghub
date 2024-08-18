# 初始化 System Config
if SystemConfig.first.blank?
  if Rails.env.development?
    SystemConfig.create(application_env: 'development')
  elsif Rails.env.staging?
    SystemConfig.create(application_env: 'staging')
  else
    SystemConfig.create(application_env: 'production')
  end
end

# 初始化模型标签
[
  ['computer_vision', 'image-classification', '单标签图像分类'],
  ['computer_vision', 'image-segmentation', '通用图像分割'],
  ['computer_vision', 'ocr', '通用字符文字识别'],
  ['computer_vision', 'skin-retouching', '人像美肤'],
  ['computer_vision', 'image-to-image', '图生图'],
  ['computer_vision', 'video-detection', '视频检测'],
  ['computer_vision', 'video-segmentation', '视频生成'],
  ['computer_vision', 'video-captioning', '视频到文本生成'],
  ['computer_vision', 'face-detection', '人脸检测'],
  ['computer_vision', 'face-recognition', '人脸识别'],
  ['computer_vision', 'face-image-generation', '人脸生成'],
  ['computer_vision', 'image-object-detection', '通用目标检测'],
  ['computer_vision', 'image-super-resolution', '图像超分辨'],
  ['computer_vision', 'action-detection', '行为检测'],
  ['computer_vision', 'semantic-segmentation', '语义分割'],
  ['natural_language_processing', 'word-segmentation', '分词'],
  ['natural_language_processing', 'named-entity-recognition', '命名实体识别'],
  ['natural_language_processing', 'part-of-speech', '词性标注'],
  ['natural_language_processing', 'document-segmentation', '文本分割'],
  ['natural_language_processing', 'text-classification', '文本分类'],
  ['natural_language_processing', 'sentiment-classification', '情感分类'],
  ['natural_language_processing', 'nli', '自然语言推理'],
  ['natural_language_processing', 'conversational', '对话'],
  ['natural_language_processing', 'translation', '翻译'],
  ['natural_language_processing', 'text-generation', '文本生成'],
  ['natural_language_processing', 'text-summarization', '文本摘要'],
  ['natural_language_processing', 'feature-extraction', '特征抽取'],
  ['natural_language_processing', 'relation-extraction', '关系抽取'],
  ['audio_processing', 'auto-speech-recognition', '语音识别'],
  ['audio_processing', 'text-to-speech', '语音合成'],
  ['audio_processing', 'audio-classification', '音频分类'],
  ['multimodal', 'text-to-image', '文本生成图片'],
  ['multimodal', 'visual-question-answering', '视觉问答'],
  ['multimodal', 'image-text-retrieval', '图文检索'],
].each do |tag|
  local_tag = Tag.find_by(tag_origin: 'system', tag_type: 'task', tag_field: tag[0], name: tag[1])
  if local_tag
    next if local_tag.scope.present?
    local_tag.update(scope: 'model')
  else
    Tag.create(tag_origin: 'system', tag_type: 'task', tag_field: tag[0], name: tag[1], zh_name: tag[2], scope: 'model')
  end
end

# 初始化数据集标签
[
  ['text_processing', 'text-classification', '文本分类'],
  ['text_processing', 'relation-extraction', '关系抽取'],
  ['text_processing', 'zero-shot', '零样本学习'],
  ['text_processing', 'translation', '机器翻译'],
  ['text_processing', 'token-classification', '词分类'],
  ['text_processing', 'conversational', '智能对话'],
  ['text_processing', 'text-generation', '文本生成'],
  ['text_processing', 'table-question-answering', '表格问答'],
  ['text_processing', 'sentence-similarity', '句子相似度'],
  ['text_processing', 'fill-mask', '完形填空'],
  ['text_processing', 'summarization', '摘要总结'],
  ['text_processing', 'question-answering', '问答'],
  ['graphics', 'image-to-text', '文字识别'],
  ['graphics', 'image-classification', '图像分类'],
  ['graphics', 'object-detection', '通用检测'],
  ['graphics', 'image-segmentation', '图像分割'],
  ['graphics', 'image-editing', '图像编辑'],
  ['graphics', 'image-generation', '图像生成'],
  ['audio', 'auto-speech-recognition', '语音识别'],
  ['audio', 'text-to-speech', '语音合成'],
  ['audio', 'speech-signal-process', '语音信号处理'],
  ['audio', 'keyword-spotting', '语音唤醒'],
  ['audio', 'audio-classification', '音频分类'],
  ['audio', 'voice-activity-detection', '语音端点检测'],
  ['video', 'object-tracking', '目标追踪'],
  ['video', 'autonomous-driving', '自动驾驶'],
  ['video', 'video-generation', '视频生成'],
  ['video', 'video-super-resolution', '视频超分辨率'],
  ['video', 'video-segmentation', '视频分割'],
  ['multimodal', 'image-captioning', '图像描述'],
  ['multimodal', 'visual-grounding', '视觉定位'],
  ['multimodal', 'text-to-image', '文本生成图片'],
  ['multimodal', 'feature-extraction', '特征抽取'],
  ['scientific_computing', 'biomedicine', '生物医学'],
  ['scientific_computing', 'protein-structure', '蛋白质结构生成'],
].each do |tag|
  local_tag = Tag.find_by(tag_origin: 'system', tag_type: 'task', tag_field: tag[0], name: tag[1])
  if local_tag
    next if local_tag.scope.present?
    local_tag.update(scope: 'dataset')
  else
    Tag.create(tag_origin: 'system', tag_type: 'task', tag_field: tag[0], name: tag[1], zh_name: tag[2], scope: 'dataset')
  end
end

[
  'PyTorch',
  'TensorFlow',
  'Safetensors',
  'JAX',
  'ONNX',
  'PaddlePaddle',
  'Joblib',
  'GGUF',
].each do |tag|
  local_tag = Tag.find_by(name: tag, tag_type: 'framework', tag_origin: 'system')
  next if local_tag
  Tag.create(tag_origin: 'system', tag_type: 'framework', name: tag, zh_name: tag)
end

[
  ['Chinese', '中文', 'cn'],
  ['English', '英文', 'en'],
  ['French', '法文', 'fr'],
  ['German', '德文', 'de'],
  ['Spanish', '西班牙文', 'es'],
  ['Japanese', '日文', 'ja'],
  ['Korean', '韩文', 'ko'],
  ['Russian', '俄文', 'ru'],
  ['Italian', '意大利文', 'it'],
  ['Portuguese', '葡萄牙文', 'pt'],
  ['Arabic', '阿拉伯文', 'ar'],
  ['Hindi', '印度文', 'hi'],
  ['Turkish', '土耳其文', 'tr'],
  ['Dutch', '荷兰语', 'nl'],
  ['Polish', '波兰文', 'pl'],
  ['Swedish', '瑞典文', 'sv'],
].each do |tag|
  local_tag = Tag.find_by(name: tag[0], tag_type: 'language', tag_origin: 'system')
  next if local_tag
  Tag.create(tag_origin: 'system', tag_type: 'language', name: tag[0], zh_name: tag[1], label: tag[2])
end

[
  ['apache-2.0', 'Apache-2.0', 1],
  ['mit', 'MIT', 2],
  ['lgpl', 'LGPL', 3],
  ['lgpl-2.1', 'LGPL-2.1', 4],
  ['lgpl-3.0', 'LGPL-3.0', 5],
  ['gpl', 'GPL', 6],
  ['gpl-2.0', 'GPL-2.0', 7],
  ['gpl-3.0', 'GPL-3.0', 8],
  ['afl-3.0', 'AFL-3.0', 9],
  ['ecl-2.0', 'ECL-2.0', 10],
  ['creativeml-openrail-m', 'CreativeML Open RAIL-M', 11],
  ['agpl-3.0', 'AGPL-3.0', 12],
  ['cc', 'CC', 13],
  ['cc0-1.0', 'CC0 1.0', 14],
  ['cc-by-4.0', 'CC BY 4.0', 15],
  ['cc-by-nc-nd-3.0', 'CC BY-NC-ND 3.0', 16],
  ['cc-by-nc-nd-4.0', 'CC BY-NC-ND 4.0', 17],
  ['cc-by-nc-4.0', 'CC BY-NC 4.0', 18],
  ['cc-by-nc-sa-2.0', 'CC BY-NC-SA 2.0', 19],
  ['cc-by-nc-sa-3.0', 'CC BY-NC-SA 3.0', 20],
  ['cc-by-nc-sa-4.0', 'CC BY-NC-SA 4.0', 21],
  ['other', 'other', 22]
].each do |tag|
  local_tag = Tag.find_by(name: tag, tag_type: 'license', tag_origin: 'system')
  next if local_tag
  Tag.create(tag_origin: 'system', tag_type: 'license', name: tag[0], zh_name: tag[1], weight: tag[2])
end
