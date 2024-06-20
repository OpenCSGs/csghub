class LandingPageController < ApplicationController
  skip_before_action :call_event_api, only: :health_check

  def health_check
    head :no_content
  end

  def index
    @partersData = [{name:'AWS',num:'20',url:'partners/aws.png'},
                    {name:'Datawhale',num:'20',url:'partners/aws.png'},
                    {name:'Datawhale',num:'20',url:'partners/aws.png'},
                    {name:'Datawhale',num:'20',url:'partners/aws.png'},
                    {name:'Datawhale',num:'20',url:'partners/aws.png'},
                    {name:'Datawhale',num:'20',url:'partners/datawhale.png'},
                    {name:'Datawhale',num:'20',url:'partners/datawhale.png'},
                    {name:'Datawhale',num:'20',url:'partners/datawhale.png'}]
    @newsData = [{url:'landing/new1.png',href:'https://blog.opencsg.com/news/8/',time:'2023/9/2',title:'OpenCSG 荣获千万天使轮融资',text:'9月伊始，北京开放传神科技有限公司（以下简称“OpenCSG”）获数千万元天使轮融资，本轮投资由 联想创投集团，北京国信中数投资管理有限公司阶段性联合领投，源合资本担任财务顾问...'},
                {url:'landing/new2.png',href:'https://blog.opencsg.com/posts/9/',time:'2023/9/15',title:'“开源开放驱动大模型生态繁荣”主题研讨',text:'2023年9月15日，由上海市徐汇区科学技术委员会、上海西岸集团、中国信通院华东分院共同承办，以“开源开放驱动大模型生态繁荣”为主题的研讨会在上海徐汇西岸AI Tower举办...'},
                {url:'landing/new3.png',href:'https://blog.opencsg.com/news/10/',time:'2023/9/28',title:'“模速空间”创新生态社区揭幕仪式',text:'9月28日，上海“模速空间”创新生态社区暨人工智能大模型产业生态集聚区在揭牌，创始人&CEO陈冉代表OpenCSG上台揭幕，成为首批入驻上海市人工智能产业生态的企业之一...'}]
    @latest_spaces = Space.where(space_type: 'public_s').order(created_at: :desc).limit(3)
    @partners = PARTNERS.sort_by {|partner| PinYin.abbr(partner['name'])}
    @hot_models = load_hot_models.to_json
    @hot_datasets = load_hot_datasets.to_json
    @hot_spaces = load_hot_spaces.to_json
    @customers = customers.to_json
  end

  private

  def customers
    system_config = SystemConfig.first
    (system_config.customers rescue []) || []
  end

  def load_hot_models
    system_config = SystemConfig.first
    hot_models = system_config.hot_models rescue []
    return [] if hot_models.blank?
    res = csghub_api.models_by_paths hot_models
    JSON.parse(res)['data'] || []
  rescue StarhubError
    []
  end

  def load_hot_datasets
    system_config = SystemConfig.first
    hot_datasets = system_config.hot_datasets rescue []
    return [] if hot_datasets.blank?
    res = csghub_api.datasets_by_paths hot_datasets
    JSON.parse(res)['data'] || []
  rescue StarhubError
    []
  end

  def load_hot_spaces
    system_config = SystemConfig.first
    hot_spaces = system_config.hot_spaces rescue []
    return [] if hot_spaces.blank?
    res = csghub_api.spaces_by_paths hot_spaces
    JSON.parse(res)['data'] || []
  rescue StarhubError
    []
  end
end
