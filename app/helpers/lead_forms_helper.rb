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
      '姓名*'
    when 'phone'
      '电话*'
    when 'company'
      '公司*'
    when 'email'
      "邮箱#{custom_required?('email') ? '*' : ''}"
    when 'title'
      "职位#{custom_required?('title') ? '*' : ''}"
    when 'industry'
      "行业#{custom_required?('industry') ? '*' : ''}"
    when 'province'
      "省份#{custom_required?('province') ? '*' : ''}"
    when 'email_opt_out'
      "不接受邮件#{custom_required?('email_opt_out') ? '*' : ''}"
    when 'num_of_employees'
      "员工数量#{custom_required?('num_of_employees') ? '*' : ''}"
    when 'additional_notes'
      "备注#{custom_required?('additional_notes') ? '*' : ''}"
    end
  end
end
