Weave::Application.routes.draw do
  resources :referrers

  match 'auth/:provider/callback', to: 'sessions#create'
  match 'auth/failure', to: redirect('/')
  match 'signout', to: 'sessions#destroy', as: 'signout'

  match "af", to: redirect("/auth/facebook")

end
