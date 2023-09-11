Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  root "hello_world#index"
  resources :landing_page

  get    '/login',   to: 'sessions#new'
  get    '/authing/callback', to: 'sessions#authing'
  post   '/login',   to: 'sessions#create'
  delete '/logout',  to: 'sessions#destroy'
  get    '/logout',  to: 'sessions#destroy'
end
