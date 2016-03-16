class RegistrationsController < Devise::RegistrationsController
  protected

  def after_sign_up_path_for(resource)
     "/footprints/#{current_user.id}/edit"
  end

 
end