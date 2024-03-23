module RepoHelper
  def name_for_meta_title repo
    JSON.parse(repo).dig('data', 'nickname').presence ||
    JSON.parse(repo).dig('data', 'name').presence || ''
  end

  def desc_for_meta_description repo
    JSON.parse(repo).fetch('data', {}).fetch('description', '')
  end
end
