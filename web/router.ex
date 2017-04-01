defmodule Momo.Router do
  use Momo.Web, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
    plug Guardian.Plug.VerifyHeader
    plug Guardian.Plug.LoadResource
  end

  scope "/", Momo do
    pipe_through :browser # Use the default browser stack

    get "/", PageController, :index
    get "/board/:id", PageController, :index
  end

  # Other scopes may use custom stacks.
  # scope "/api", Momo do
  #   pipe_through :api
  # end
  #
  scope "/api", Momo do
    pipe_through :api

    scope "/v1" do
      post "/registrations", RegistrationController, :create
      post "/sessions", SessionController, :create
      delete "/sessions", SessionController, :delete
      get "/current_user", CurrentUserController, :show
      resources "/boards", BoardController, only: [:index, :create]
    end
  end

end
