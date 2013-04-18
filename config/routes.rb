Weave::Application.routes.draw do
  devise_for :users, controllers: {omniauth_callbacks: "omniauth_callbacks"}

  resources :referrers

  match 'auth/:provider/callback', to: 'sessions#create'
  match 'auth/failure', to: redirect('/')
  # match 'signout', to: 'sessions#destroy', as: 'signout'

  match 'af', to: redirect("/auth/facebook")
  match 'welcome', to: 'referrers#welcome'

  root to: 'referrals#new'

end
