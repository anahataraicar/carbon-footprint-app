Rails.application.routes.draw do
  
  devise_for :users
  root 'footprints#index'
  get '/footprints/new' => 'footprints#new'
  post '/footprints' => 'footprints#create'

  get '/footprints/slider' => 'footprints#slider'

  
  get '/footprints/:id' => 'footprints#show'
  get '/footprints/:id/edit' => 'footprints#edit'
  patch '/footprints/:id' => 'footprints#update'


end
