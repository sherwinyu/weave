Weave::Application.routes.draw do
  devise_for :users, controllers: {omniauth_callbacks: "omniauth_callbacks"}

  # match '*', to: "

  resources :incentives

  resources :incentive_instances

  resources :referral_batches do
    resources :referrals
  end
  resources :referrals, only: [:update, :create]

  # resources :referrers
  # match 'auth/:provider/callback', to: 'sessions#create'
  # match 'signout', to: 'sessions#destroy', as: 'signout'

  # match 'af', to: redirect("/auth/facebook")
  match 'welcome', to: 'referrers#welcome'

  match 'THISSHOULDNTEVERHAPPEN/BUTITNEEDSTOBEHERE', to: redirect('/WALAWALWAWALAK')
  root to: 'referrals#new'

  mount JasmineRails::Engine => "/specs" if defined?(JasmineRails)
end
