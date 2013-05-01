Weave::Application.routes.draw do
  devise_for :users, controllers: {omniauth_callbacks: "omniauth_callbacks"}

  resources :campaigns

  resources :incentives

  resources :incentive_instances

  resources :referral_batches


  resources :referrers

  # match 'auth/:provider/callback', to: 'sessions#create'
  # match 'signout', to: 'sessions#destroy', as: 'signout'

  # match 'af', to: redirect("/auth/facebook")
  match 'welcome', to: 'referrers#welcome'

  match 'THISSHOULDNTEVERHAPPEN/BUTITNEEDSTOBEHERE', to: redirect('/WALAWALWAWALAK')
  root to: 'referrals#new'

end
