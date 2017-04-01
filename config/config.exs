# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# General application configuration
config :momo,
  ecto_repos: [Momo.Repo]

# Configures the endpoint
config :momo, Momo.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "sH8sUzNBLk3m3GaIQuPiQdvs67U/vAhieC2/vIZuLMSlV/pJFlMYyqXEXH/XJSSe",
  render_errors: [view: Momo.ErrorView, accepts: ~w(html json)],
  pubsub: [name: Momo.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

config :guardian, Guardian,
  issuer: "Momo",
  ttl: { 3, :days },
  verify_issuer: true,
  secret_key: {MySecretKey, :fetch},
  serializer: Momo.GuardianSerializer

defmodule MySecretKey do
  def fetch do
    JOSE.JWK.from_oct_file("secret-key.bin")
  end
end

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"
