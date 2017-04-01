defmodule Momo.Repo.Migrations.CreateArchivedList do
  use Ecto.Migration

  def change do
    create table(:archived_lists) do
      add :title, :string, null: false
      add :original_id, :integer, null: false
      add :board_id, references(:boards, on_delete: :delete_all), null: false
      add :user_id, references(:users, on_delete: :delete_all), null: false

      timestamps()
    end
    create index(:archived_lists, [:board_id])
    create index(:archived_lists, [:user_id])

  end
end
