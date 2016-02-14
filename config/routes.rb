Rails.application.routes.draw do
  
  devise_for :users
  root 'habits#index'
  get '/habits/new' => 'habits#new'
  post '/habits' => 'habits#create'
  get '/habits/:id' => 'habits#show'

end
