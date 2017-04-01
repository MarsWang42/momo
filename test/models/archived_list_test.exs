defmodule Momo.ArchivedListTest do
  use Momo.ModelCase

  alias Momo.ArchivedList

  @valid_attrs %{original_id: 42, title: "some content"}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = ArchivedList.changeset(%ArchivedList{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = ArchivedList.changeset(%ArchivedList{}, @invalid_attrs)
    refute changeset.valid?
  end
end
