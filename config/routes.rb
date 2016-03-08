Rails.application.routes.draw do
  
  devise_for :users
  root 'footprints#index'
  get '/footprints/new' => 'footprints#new'
  post '/footprints' => 'footprints#create'
  get '/footprints/:id' => 'footprints#show'
  get '/footprints/:id/edit' => 'footprints#edit'
  patch '/footprints/:id' => 'footprints#update'

  namespace :api do
    namespace :v1 do
      get '/footprints' => 'footprints#index'
      get '/footprints/:id' => 'footprints#show'
    end
  end


end
