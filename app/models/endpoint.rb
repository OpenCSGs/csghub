class Endpoint < ApplicationRecord
  enum :visibility, { endpoint_public: 'public', endpoint_private: 'private' }, default: :endpoint_private

  belongs_to :owner, polymorphic: true
  belongs_to :creator, class_name: 'User', foreign_key: :creator_id
end
