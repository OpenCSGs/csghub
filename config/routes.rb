Rails.application.routes.draw do
  # admin
  namespace :admin do
    resources :spaces
    resources :users
    resources :comments
    
    root to: "spaces#index"
  end

  # api
  namespace :api do
    resources :spaces, only: [:create, :destroy, :update, :show, :index]
    resources :comments, only: [:create, :destroy]
  end

  # lead form
  # resources :lead_forms do
  #   collection do
  #     get 'thank-you'
  #   end
  #   member do
  #     post :toggle_lead_form_status
  #   end
  # end

  # get 'lead_forms/form/:uuid', to: 'lead_forms#show_form'

  # application
  scope "(:locale)", :locale => /en|zh/ do
    root "landing_page#index"

    resources :spaces, only: ['index', 'show', 'update'] do
      collection do
        get 'stopped'
      end
    end

    get '/partners', to: 'partners#index'
    get '/experts', to: 'experts#index'
    get '/datasets', to: 'datasets#index'
    get '/models', to: 'models#index'

    get    '/login',   to: 'sessions#new'
    get    '/authing/callback', to: 'sessions#authing'
    post   '/login',   to: 'sessions#create'
    delete '/logout',  to: 'sessions#destroy'
    get    '/logout',  to: 'sessions#destroy'
  end
end
