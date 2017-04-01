defmodule Momo.ArchivedList do
  use Momo.Web, :model

  @derive {Poison.Encoder, only: [:id, :title, :original_id]}

  schema "archived_lists" do
    field :title, :string
    field :original_id, :integer
    belongs_to :board, Momo.Board
    belongs_to :user, Momo.User

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:title, :original_id, :board_id, :user_id])
    |> validate_required([:title, :original_id, :board_id, :user_id])
  end
end
