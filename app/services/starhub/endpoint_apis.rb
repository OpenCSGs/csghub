module Starhub
  module EndpointApis
    def get_endpoint_detail(namespace, model_name, endpoint_id, options = {})
      res = @client.get("/models/#{namespace}/#{model_name}/run/#{endpoint_id}", options)
      raise StarhubError, res.body unless res.success?
      res.body
    end
  end
end
