Rails.application.routes.draw do
  
  devise_for :users, controllers: { registrations: "registrations" }
  
  root 'footprints#index'
  get '/download_pdf' => 'footprints#download_pdf'

  get '/footprints/:id' => 'footprints#show'

  namespace :api do
    namespace :v1 do
      get '/footprints' => 'footprints#index'
      get '/footprints/:id' => 'footprints#show'
      patch '/footprints/:id' => 'footprints#update'
    end
  end

end
