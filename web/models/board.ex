defmodule Momo.Board do
  use Momo.Web, :model

  alias Momo.{Repo, List, Comment, Task, UserBoard, User, ArchivedTask, ArchivedList}

  schema "boards" do
    field :title, :string
    belongs_to :user, User
    has_many :user_boards, UserBoard
    has_many :lists, List
    has_many :tasks, through: [:lists, :tasks]
    has_many :archived_tasks, ArchivedTask
    has_many :archived_lists, ArchivedList
    has_many :members, through: [:user_boards, :user]

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:title])
    |> validate_required([:title])
  end

  def not_owned_by(query \\ %Momo.Board{}, user_id) do
    from b in query,
    where: b.user_id != ^user_id
  end

  def preload_all(query) do

    tasks_query = from c in Task, order_by: c.position, preload: [:user]
    lists_query = from l in List, order_by: l.position, preload: [tasks: ^tasks_query]
    from q in query, preload: [:user, :members, lists: ^lists_query]
  end
end

defimpl Poison.Encoder, for: Momo.Board do
  def encode(model, options) do
    model
    |> Map.take([:title, :user, :members, :id, :lists])
    |> Poison.Encoder.encode(options)
  end
end
