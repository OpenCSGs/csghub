module Starhub
  module EndpointApis
    def get_endpoint_detail(namespace, model_name, endpoint_id, options = {})
      res = @client.get("/models/#{namespace}/#{model_name}/run/#{endpoint_id}", options)
      raise StarhubError, res.body unless res.success?
      res.body
    end

    def create_endpoint(endpoint, options = {})
      options[:deploy_name] = endpoint.name
      options[:hardware] = endpoint.cloud_resource
      options[:resource_id] = endpoint.cloud_resource
      options[:min_replica] = endpoint.min_replica
      options[:max_replica] = endpoint.max_replica
      options[:runtime_framework_id] = endpoint.framework_id
      options[:secure_level] = endpoint.endpoint_private? ? 2 : 1
      options[:cluster_id] = endpoint.cluster_id

      @client.post("/models/#{endpoint.model_path}/run?current_user=#{endpoint.owner.name}", options)
    end

    def update_endpoint(endpoint, options = {})
      options[:deploy_name] = endpoint.name
      options[:cluster_id] = endpoint.cluster_id
      options[:hardware] = endpoint.cloud_resource
      options[:resource_id] = endpoint.cloud_resource
      options[:min_replica] = endpoint.min_replica
      options[:max_replica] = endpoint.max_replica
      options[:runtime_framework_id] = endpoint.framework_id
      options[:secure_level] = endpoint.endpoint_private? ? 2 : 1

      @client.put("/models/#{endpoint.model_path}/run/#{endpoint.endpoint_id}?current_user=#{endpoint.owner.name}", options)
    end

    def delete_endpoint(endpoint, options = {})
      @client.delete("/models/#{endpoint.model_path}/run/#{endpoint.endpoint_id}?current_user=#{endpoint.owner.name}", options)
    end
  end
end
