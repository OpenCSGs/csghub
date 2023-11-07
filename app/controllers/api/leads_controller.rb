class Api::LeadsController < Api::ApplicationController

  def create
    lead = Lead.create(create_params.slice(:name, :title, :phone, :company, :expertise, :introduction))

    if lead.save
      render json: { message: "Lead created" }
    else
      render json: {message: "Failed to create lead"}, status: :bad_request
    end
  end


  def create_params
    params.require(:lead).permit(:name, :title, :phone, :company, :expertise, :introduction)
  end
end

