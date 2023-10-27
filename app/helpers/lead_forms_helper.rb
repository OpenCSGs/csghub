module LeadFormsHelper
  def available_lead_source
    ENV.fetch('LEAD_SOURCES', '').split(',').map(&:strip)
  end

  def selected_fields
    @lead_form.lead_fields
  end

  def unselected_fields
    LeadForm.available_form_fields - @lead_form.lead_fields
  end

  def custom_required? field
    @lead_form&.custom_required_fields&.include?(field)
  end
end

