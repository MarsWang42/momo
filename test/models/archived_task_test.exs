defmodule Momo.ArchivedTaskTest do
  use Momo.ModelCase

  alias Momo.ArchivedTask

  @valid_attrs %{description: "some content", original_id: 42, title: "some content"}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = ArchivedTask.changeset(%ArchivedTask{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = ArchivedTask.changeset(%ArchivedTask{}, @invalid_attrs)
    refute changeset.valid?
  end
end
