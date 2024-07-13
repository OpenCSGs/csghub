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

  def field_display_name(field)
    case field
    when 'name'
      "#{I18n.t('lead_form.name')}*"
    when 'phone'
      "#{I18n.t('lead_form.phone')}*"
    when 'company'
      "#{I18n.t('lead_form.company')}*"
    when 'email'
      "#{I18n.t('lead_form.email')}*"
    when 'demand'
      "#{I18n.t('lead_form.demand')}#{custom_required?('demand') ? '*' : ''}"
    when 'title'
      "#{I18n.t('lead_form.title')}#{custom_required?('title') ? '*' : ''}"
    when 'industry'
      "#{I18n.t('lead_form.industry')}#{custom_required?('industry') ? '*' : ''}"
    when 'province'
      "#{I18n.t('lead_form.province')}#{custom_required?('province') ? '*' : ''}"
    when 'email_opt_out'
      "#{I18n.t('lead_form.email_opt_out')}#{custom_required?('email_opt_out') ? '*' : ''}"
    when 'num_of_employees'
      "#{I18n.t('lead_form.num_of_employees')}#{custom_required?('num_of_employees') ? '*' : ''}"
    when 'computing_demand'
      "#{I18n.t('lead_form.computing_demand')}"
    when 'additional_notes'
      "#{I18n.t('lead_form.additional_notes')}#{custom_required?('additional_notes') ? '*' : ''}"
    end
  end
end
