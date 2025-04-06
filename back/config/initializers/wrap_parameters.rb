# config/initializers/wrap_parameters.rb
ActiveSupport.on_load(:action_controller) do
  wrap_parameters format: []
end
