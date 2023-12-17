Rails.application.routes.draw do
  # admin
  namespace :admin do
    resources :system_configs
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
    resources :system_api_keys
    resources :tags
    resources :models, except: [:new, :create]

    root to: "spaces#index"
  end

  # external api
  namespace :api do
    resources :spaces, only: [:create, :destroy, :update]
  end

  # internal api
  namespace :internal_api do
    resources :organizations, only: [:create, :update]
    resources :spaces, only: [:index, :update]
    resources :campaigns, only: [:index]
    resources :comments, only: [:create, :destroy]
    resources :leads, only: [:create]
    resources :ssh_keys, only: [:create, :destroy]
    resources :users, only: [:update]
    resources :models, only: [:create]
    resources :tags, only: [] do
      collection do
        get 'task-tags', to: 'tags#task_tags'
        get 'framework-tags', to: 'tags#framework_tags'
      end
    end
    resources :discussions, only: :create
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
        get 'git-token'
        get 'ssh-keys'
      end
    end

    resources :spaces, only: ['index', 'show'] do
      collection do
        get 'stopped'
      end
    end

    resources :campaigns, only: [:index, :show]
    resources :models, only: [:index, :new]
    resources :organizations, only: [:new]

    get '/models/:user_name/:model_name', to: 'models#show'
    delete '/models/:user_name/:model_name', to: 'models#destroy'
    get '/new_models', to: 'models#new_index'
    get '/new_datasets', to: 'datasets#new_index'
    get '/profile/:user_id', to: 'profile#index'
    get '/partners', to: 'partners#index'
    get '/partners/apply', to: 'partners#apply'
    get '/experts', to: 'experts#index'
    get '/experts/apply', to: 'experts#apply'
    get '/datasets', to: 'datasets#index'

    get    '/signup', to: 'sessions#signup'
    get    '/login', to: 'sessions#new'
    get    '/authing/callback', to: 'sessions#authing'
    get    '/oidc/callback', to: 'sessions#oidc'
    post   '/login',   to: 'sessions#create'
    delete '/logout',  to: 'sessions#destroy'
    get    '/logout',  to: 'sessions#destroy'
  end
end
