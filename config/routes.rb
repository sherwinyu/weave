Weave::Application.routes.draw do
  resources :campaigns

  resources :incentives

  resources :incentive_instances

  resources :referral_batches

  resources :referrals

  devise_for :users, controllers: {omniauth_callbacks: "omniauth_callbacks"}
  # match 'auth/:provider/callback', to: 'sessions#create'
  # match 'auth/failure', to: redirect('/')
  # match 'signout', to: 'sessions#destroy', as: 'signout'

  # match 'af', to: redirect("/auth/facebook")
  match 'welcome', to: 'referrers#welcome'

  root to: 'referral_batches#new'

end
