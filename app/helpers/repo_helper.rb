module RepoHelper
  def name_for_meta_title repo
    JSON.parse(repo).fetch('data', {}).fetch('nickname', nil).presence ||
    JSON.parse(repo).fetch('data', {}).fetch('name', '')
  end

  def desc_for_meta_description repo
    JSON.parse(repo).fetch('data', {}).fetch('description', '')
  end
end
