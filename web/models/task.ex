defmodule Momo.Task do
  use Momo.Web, :model

  alias Momo.{Repo, List, Task}

  @derive {Poison.Encoder, only: [:id, :list_id, :title, :description, :user]}

  schema "tasks" do
    field :title, :string
    field :description, :string
    field :position, :integer
    belongs_to :list, Momo.List
    belongs_to :user, Momo.User

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:title, :list_id, :description, :position, :user_id])
    |> validate_required([:title, :list_id, :user_id])
    |> calculate_position
  end

  def update_changeset(struct, params \\ :empty) do
    struct
    |> cast(params, [:title, :list_id, :description, :position])
    |> validate_required([:title, :list_id])
  end

  def preload_all(query \\ %Task{}) do
    from c in query, preload: [:user]
  end

  defp calculate_position(current_changeset) do
    data = current_changeset.data

    query = from(c in Task,
            select: c.position,
            where: c.list_id == ^(data.list_id),
            order_by: [desc: c.position],
            limit: 1)

    case Repo.one(query) do
      nil      -> put_change(current_changeset, :position, 1024)
      position -> put_change(current_changeset, :position, position + 1024)
    end
  end
end
