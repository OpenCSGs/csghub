Rails.application.routes.draw do
  # admin
  namespace :admin do
    resources :spaces
    resources :users do
      get :export, on: :collection
    end
    resources :comments
    resources :leads
    resources :campaigns do
      member do
        post :toggle_campaign_recommended
      end
    end
    resources :lead_forms do
      member do
        post :toggle_lead_form_status
      end
    end

    root to: "spaces#index"
  end

  # api
  namespace :api do
    resources :spaces, only: [:create, :destroy, :update, :show, :index]
    resources :comments, only: [:create, :destroy]
    resources :users, only: [:update]
    resources :campaigns, only: [:index]
    resources :leads, only: [:create]
  end

  # lead form
  resources :lead_forms, only: [] do
    collection do
      get 'thank-you'
    end
  end

  get 'lead_forms/form/:uuid', to: 'lead_forms#show_form'

  resources :leads, only: [:create]

  # application
  scope "(:locale)", :locale => /en|zh/ do
    root "landing_page#index"

    resources :settings, only: [] do
      collection do
        get 'profile'
      end
    end

    resources :spaces, only: ['index', 'show', 'update'] do
      collection do
        get 'stopped'
      end
    end

    resources :campaigns, only: [:index, :show]

    get '/profile/:user_id', to: 'profile#index'
    get '/partners', to: 'partners#index'
    get '/partners/apply', to: 'partners#apply'
    get '/experts', to: 'experts#index'
    get '/experts/apply', to: 'experts#apply'
    get '/datasets', to: 'datasets#index'
    get '/models', to: 'models#index'

    get    '/login',   to: 'sessions#new'
    get    '/authing/callback', to: 'sessions#authing'
    post   '/login',   to: 'sessions#create'
    delete '/logout',  to: 'sessions#destroy'
    get    '/logout',  to: 'sessions#destroy'
  end
end
