module Starhub
  module EndpointApis
    def create_endpoint(endpoint, options = {})
      options[:deploy_name] = endpoint.name
      options[:hardware] = endpoint.cloud_resource
      options[:min_replica] = endpoint.min_replica
      options[:max_replica] = endpoint.max_replica
      options[:runtime_framework_id] = endpoint.framework_id
      options[:secure_level] = endpoint.endpoint_private? ? 2 : 1
      options[:cluster_id] = endpoint.cluster_id

      @client.post("/models/#{endpoint.model_path}/run?current_user=#{endpoint.owner.name}", options)
    end
  end
end
