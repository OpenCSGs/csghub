LEAD_FORM_HOST = if Rails.env.production?
                   'https://opencsg.com'
                 elsif Rails.env.staging?
                   'https://portal-stg.opencsg.com'
                 else
                   'http://localhost:3000'
                 end
