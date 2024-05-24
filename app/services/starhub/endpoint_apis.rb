module Starhub
  module EndpointApis
    def get_endpoint_detail(namespace, endpoint_name, options = {})
      get_repo_detail('endpoints', namespace, endpoint_name, options)
    end
  end
end
