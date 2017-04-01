defmodule Momo.Repo.Migrations.CreateArchivedTask do
  use Ecto.Migration

  def change do
    create table(:archived_tasks) do
      add :title, :string, null: false
      add :original_id, :integer, null: false
      add :description, :text
      add :list_id, references(:lists, on_delete: :delete_all), null: false
      add :user_id, references(:users, on_delete: :delete_all), null: false
      add :board_id, references(:boards, on_delete: :delete_all), null: false

      timestamps()
    end
    create index(:archived_tasks, [:user_id])
    create index(:archived_tasks, [:board_id])
    create index(:archived_tasks, [:list_id])

  end
end
