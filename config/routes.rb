Weave::Application.routes.draw do
  devise_for :users, controllers: {omniauth_callbacks: "omniauth_callbacks", registrations: "users"}
  devise_scope :user do
    match 'users/:id', to: 'users#update_email', via: [:post, :put]
  end

  # match '*', to: "

  resources :incentives

  resources :incentive_instances

  resources :referral_batches do
    resources :referrals do
    end
  end
  resources :campaigns, only: [:show]
  resources :referrals, only: [:update, :create, :show]
  resources :campaigns, only: [:show, :create, :update]
  resources :products, only: [:show, :index]

  match 'welcome', to: 'referrers#welcome'

  match 'THISSHOULDNTEVERHAPPEN/BUTITNEEDSTOBEHERE', to: redirect('/WALAWALWAWALAK')
  root to: 'referrals#new'

  mount JasmineRails::Engine => "/specs" if defined?(JasmineRails)
end
