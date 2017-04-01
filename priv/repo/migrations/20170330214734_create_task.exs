defmodule Momo.Repo.Migrations.CreateTask do
  use Ecto.Migration

  def change do
    create table(:tasks) do
      add :title, :string, null: false
      add :position, :integer, default: 0
      add :description, :text
      add :list_id, references(:lists, on_delete: :delete_all), null: false
      add :user_id, references(:users, on_delete: :delete_all), null: false

      timestamps()
    end
    create index(:tasks, [:list_id])
    create index(:tasks, [:user_id])

  end
end
