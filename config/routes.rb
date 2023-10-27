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

  # landing pages
  # resources :landing_pages do
  #   collection do
  #     get 'thank-you'
  #   end
  #   member do
  #     post :toggle_landing_page_status
  #   end
  # end

  # application
  scope "(:locale)", :locale => /en|zh/ do
    root "home#index"

    resources :spaces, only: ['index', 'show', 'update'] do
      collection do
        get 'stopped'
      end
    end
  
    get 'landing_pages/form/:uuid', to: 'landing_pages#show_form'

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
