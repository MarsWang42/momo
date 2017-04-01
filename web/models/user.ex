defmodule Momo.User do
  use Momo.Web, :model

  @derive {Poison.Encoder, only: [:id, :first_name, :last_name, :email]}

  schema "users" do
    field :first_name, :string
    field :last_name, :string
    field :email, :string
    field :password, :string, virtual: true
    field :encrypted_password, :string
    has_many :owned_boards, Momo.Board
    has_many :tasks, Momo.Task
    has_many :user_boards, Momo.UserBoard
    has_many :archived_tasks, Momo.ArchivedTask
    has_many :archived_lists, Momo.ArchivedList
    has_many :boards, through: [:user_boards, :board]

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:first_name, :last_name, :email, :password, :encrypted_password])
    |> validate_required([:first_name, :last_name, :email, :password])
    |> validate_format(:email, ~r/@/)
    |> validate_length(:password, min: 5)
    |> validate_confirmation(:password, message: "Password does not match")
    |> unique_constraint(:email, message: "Email already taken")
    |> generate_encrypted_password
  end

  defp generate_encrypted_password(current_changeset) do
    case current_changeset do
      %Ecto.Changeset{valid?: true, changes: %{password: password}} ->
        put_change(current_changeset, :encrypted_password, Comeonin.Bcrypt.hashpwsalt(password))
      _ ->
        current_changeset
    end
  end

end
