module LandingPagesHelper
  def available_lead_source
    ENV.fetch('LEAD_SOURCES', '').split(',').map(&:strip)
  end

  def selected_fields
    @landing_page.lead_fields
  end

  def unselected_fields
    LandingPage.available_form_fields - @landing_page.lead_fields
  end

  def custom_required? field
    @landing_page&.custom_required_fields&.include?(field)
  end
end

