defmodule Momo.Card do
  use Momo.Web, :model

  schema "cards" do
    field :name, :string
    belongs_to :list, Momo.List

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:name])
    |> validate_required([:name])
  end
end
