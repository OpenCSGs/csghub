Rails.application.routes.draw do
  # admin
  namespace :admin do
    resources :system_configs
    resources :tags

    root to: "system_configs#index"
  end

  # internal api
  namespace :internal_api do
    namespace :admin do
      resources :users, only: [:index, :show]
      resources :sync_settings, only: [:index, :create] do
        collection do
          get :sync_repos
        end
      end
      resources :system_config, only: [:index, :update]
    end
    resources :comments, only: [:create, :destroy, :index]
    resources :users, only: [:index] do
      collection do
        put 'jwt_token', to: 'users/jwt_token'
      end
    end
    resources :tags, only: [] do
      collection do
        get 'task-tags', to: 'tags#task_tags'
        get 'framework-tags', to: 'tags#framework_tags'
        get 'language-tags', to: 'tags#language_tags'
      end
    end
    # resources :discussions, only: :create
    resources :discussions, only: [:create, :index, :update]
    resources :upload, only: [:create]
  end # end of internal api

  # application
  scope "(:locale)", :locale => /en|zh/ do
    root "models#index"

    # New Admin Pannel routes
    get '/new_admin/(*path)', to: 'new_admin#index'

    resources :settings, only: [] do
      collection do
        get 'profile'
        get 'access-token'
        get 'starship-access-token'
        get 'sync-access-token'
        get 'ssh-keys'
        get 'locale'
      end
    end

    resources :models, only: [:index, :new]
    resources :datasets, only: [:index, :new]
    resources :codes, only: [:index, :new]
    resources :spaces, controller: 'application_spaces', only: [:index, :new]
    resources :collections, only: [:index, :new]
    resources :endpoints, only: [:index, :new]
    resources :collections, only: [:index, :new]
    resources :finetune, only: [:index, :new]
    resources :organizations, only: [:new, :show, :edit] do
      member do
        get 'members'
      end
    end
    get '/models/:namespace/(*model_name)/:branch/new', to: 'models#new_file', namespace: /[^\/]+/
    get '/models/:namespace/(*model_name)/edit/:branch/(*path)', to: 'models#edit_file', format: false, defaults: {format: 'html'}, namespace: /[^\/]+/
    get '/models/:namespace/(*model_name)/:branch/upload', to: 'models#upload_file', namespace: /[^\/]+/
    get '/models/:namespace/(*model_name)/blob/:branch/(*path)', to: 'models#blob', format: false, defaults: {format: 'html'}, namespace: /[^\/]+/
    get '/models/:namespace/(*model_name)/files/:branch(/*path)', to: 'models#files', defaults: { path: nil }, namespace: /[^\/]+/
    get '/models/:namespace/(*model_name)/resolve/:branch/(*path)', to: 'models#resolve', defaults: {format: 'txt'}, namespace: /[^\/]+/
    get '/models/:namespace/(*model_name)/community', to: 'models#community', namespace: /[^\/]+/
    get '/models/:namespace/(*model_name)/settings', to: 'models#settings', namespace: /[^\/]+/
    get '/models/:namespace/(*model_name)/commits', to: 'models#commits', namespace: /[^\/]+/
    get '/models/:namespace/(*model_name)/commit/:commit_id', to: 'models#commit', namespace: /[^\/]+/
    get '/models/:namespace/(*model_name)', to: 'models#show', format: false, defaults: {format: 'html'}, namespace: /[^\/]+/

    get '/endpoints/:namespace/(*model_name)/:endpoint_id/logs', to: 'endpoints#logs', namespace: /[^\/]+/
    get '/endpoints/:namespace/(*model_name)/:endpoint_id/billing', to: 'endpoints#billing', namespace: /[^\/]+/
    get '/endpoints/:namespace/(*model_name)/:endpoint_id/settings', to: 'endpoints#settings', namespace: /[^\/]+/
    get '/endpoints/:namespace/(*model_name)/:endpoint_id', to: 'endpoints#show', namespace: /[^\/]+/

    get '/finetune/:namespace/(*name)/(*finetune_name)/:finetune_id/(*path)', to: 'finetune#show', namespace: /[^\/]+/

    get '/collections/:collections_id/(*path)', to: 'collections#show', namespace: /[^\/]+/

    get '/datasets/:namespace/(*dataset_name)/:branch/new', to: 'datasets#new_file', namespace: /[^\/]+/
    get '/datasets/:namespace/(*dataset_name)/edit/:branch/(*path)', to: 'datasets#edit_file', format: false, defaults: {format: 'html'}, namespace: /[^\/]+/
    get '/datasets/:namespace/(*dataset_name)/:branch/upload', to: 'datasets#upload_file', namespace: /[^\/]+/
    get '/datasets/:namespace/(*dataset_name)/blob/:branch/(*path)', to: 'datasets#blob', format: false, defaults: {format: 'html'}, namespace: /[^\/]+/
    get '/datasets/:namespace/(*dataset_name)/files/:branch(/*path)', to: 'datasets#files', defaults: { path: nil }, namespace: /[^\/]+/
    get '/datasets/:namespace/(*dataset_name)/resolve/:branch/(*path)', to: 'datasets#resolve', defaults: {format: 'txt'}, namespace: /[^\/]+/
    get '/datasets/:namespace/(*dataset_name)/community', to: 'datasets#community', namespace: /[^\/]+/
    get '/datasets/:namespace/(*dataset_name)/settings', to: 'datasets#settings', namespace: /[^\/]+/
    get '/datasets/:namespace/(*dataset_name)/commits', to: 'datasets#commits', namespace: /[^\/]+/
    get '/datasets/:namespace/(*dataset_name)/commit/:commit_id', to: 'datasets#commit', namespace: /[^\/]+/
    get '/datasets/:namespace/(*dataset_name)', to: 'datasets#show', format: false, defaults: {format: 'html'}, namespace: /[^\/]+/

    get '/codes/:namespace/(*code_name)/:branch/new', to: 'codes#new_file', namespace: /[^\/]+/
    get '/codes/:namespace/(*code_name)/edit/:branch/(*path)', to: 'codes#edit_file', format: false, defaults: {format: 'html'}, namespace: /[^\/]+/
    get '/codes/:namespace/(*code_name)/:branch/upload', to: 'codes#upload_file', namespace: /[^\/]+/
    get '/codes/:namespace/(*code_name)/blob/:branch/(*path)', to: 'codes#blob', format: false, defaults: {format: 'html'}, namespace: /[^\/]+/
    get '/codes/:namespace/(*code_name)/files/:branch(/*path)', to: 'codes#files', defaults: { path: nil }, namespace: /[^\/]+/
    get '/codes/:namespace/(*code_name)/resolve/:branch/(*path)', to: 'codes#resolve', defaults: {format: 'txt'}, namespace: /[^\/]+/
    get '/codes/:namespace/(*code_name)/community', to: 'codes#community', namespace: /[^\/]+/
    get '/codes/:namespace/(*code_name)/settings', to: 'codes#settings', namespace: /[^\/]+/
    get '/codes/:namespace/(*code_name)/commits', to: 'codes#commits', namespace: /[^\/]+/
    get '/codes/:namespace/(*code_name)/commit/:commit_id', to: 'codes#commit', namespace: /[^\/]+/
    get '/codes/:namespace/(*code_name)', to: 'codes#show', format: false, defaults: {format: 'html'}, namespace: /[^\/]+/

    get '/spaces/:namespace/(*application_space_name)/:branch/new', to: 'application_spaces#new_file', namespace: /[^\/]+/
    get '/spaces/:namespace/(*application_space_name)/edit/:branch/(*path)', to: 'application_spaces#edit_file', format: false, defaults: {format: 'html'}, namespace: /[^\/]+/
    get '/spaces/:namespace/(*application_space_name)/:branch/upload', to: 'application_spaces#upload_file', namespace: /[^\/]+/
    get '/spaces/:namespace/(*application_space_name)/blob/:branch/(*path)', to: 'application_spaces#blob', format: false, defaults: {format: 'html'}, namespace: /[^\/]+/
    get '/spaces/:namespace/(*application_space_name)/files/:branch(/*path)', to: 'application_spaces#files', defaults: { path: nil }, namespace: /[^\/]+/
    get '/spaces/:namespace/(*application_space_name)/resolve/:branch/(*path)', to: 'application_spaces#resolve', defaults: {format: 'txt'}, namespace: /[^\/]+/
    get '/spaces/:namespace/(*application_space_name)/community', to: 'application_spaces#community', namespace: /[^\/]+/
    get '/spaces/:namespace/(*application_space_name)/settings', to: 'application_spaces#settings', namespace: /[^\/]+/
    get '/spaces/:namespace/(*application_space_name)/billing', to: 'application_spaces#billing', namespace: /[^\/]+/
    get '/spaces/:namespace/(*application_space_name)/commits', to: 'application_spaces#commits', namespace: /[^\/]+/
    get '/spaces/:namespace/(*application_space_name)/commit/:commit_id', to: 'application_spaces#commit', namespace: /[^\/]+/
    get '/spaces/:namespace/(*application_space_name)', to: 'application_spaces#show', format: false, defaults: {format: 'html'}, namespace: /[^\/]+/

    get '/resource-console', to: 'resource_console#index'
    
    get '/profile/:user_id', to: 'profile#index', user_id: /[^\/]+/
    get '/profile/likes/:user_id', to: 'profile#likes', user_id: /[^\/]+/
    get    '/signup', to: 'sessions#signup'
    get    '/login', to: 'sessions#new'
    get    '/oidc/callback', to: 'sessions#oidc'
    get    '/server/callback', to: 'sessions#server'
    post   '/login',   to: 'sessions#create'
    post   '/signup',   to: 'sessions#registration'
    delete '/logout',  to: 'sessions#destroy'
    get    '/logout',  to: 'sessions#destroy'

    # errors
    get '/errors/not-found', to: 'errors#not_found'
    get '/errors/unauthorized', to: 'errors#unauthorized'
    get '/errors/login-failed', to: 'errors#login_failed'
  end
end
