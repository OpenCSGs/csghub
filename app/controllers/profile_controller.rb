class ProfileController < ApplicationController
  def index
    @latest_profile_spaces = Space.where(space_type: 'public_s').order(created_at: :desc).limit(2)
  end
end
