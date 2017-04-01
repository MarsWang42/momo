defmodule Momo.ArchivedTask do
  use Momo.Web, :model

  alias Momo.{Board, User, List, Task}

  @derive {Poison.Encoder, only: [:id, :list_id, :title, :description, :original_id, :user]}

  schema "archived_tasks" do
    field :title, :string
    field :original_id, :integer
    field :description, :string
    belongs_to :board, Board
    belongs_to :list, List
    belongs_to :user, User

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:title, :original_id, :description, :board_id, :list_id, :user_id])
    |> validate_required([:title, :original_id, :board_id, :list_id, :user_id])
  end
end
