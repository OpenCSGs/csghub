module LeadFormsHelper
  def available_lead_source
    ENV.fetch('LEAD_SOURCES', '').split(',').map(&:strip)
  end

  def form_fields_for(resource)
    form_fields = LeadForm.available_form_fields
    resource.new_record? ? form_fields : (resource.lead_fields + form_fields).uniq
  end

  def custom_required? field
    @lead_form&.custom_required_fields&.include?(field)
  end
end
