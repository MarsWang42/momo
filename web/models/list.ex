defmodule Momo.List do
  use Momo.Web, :model

  alias Momo.{Board, Repo, List, Task}

  @derive {Poison.Encoder, only: [:id, :board_id, :title, :tasks, :position]}

  schema "lists" do
    field :title, :string
    field :position, :integer
    belongs_to :board, Board
    has_many :tasks, Task

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:title, :position])
    |> validate_required([:title])
    |> calculate_position
  end

  def update_changeset(struct, params \\ :empty) do
    struct
    |> cast(params, [:title, :position])
    |> validate_required([:title])
  end

  defp calculate_position(current_changeset) do
    data = current_changeset.data

    query = from(l in List,
            select: l.position,
            where: l.board_id == ^(data.board_id),
            order_by: [desc: l.position],
            limit: 1)

    case Repo.one(query) do
      nil      -> put_change(current_changeset, :position, 1024)
      position -> put_change(current_changeset, :position, position + 1024)
    end
  end
end
