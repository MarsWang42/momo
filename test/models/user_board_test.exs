defmodule Momo.UserBoardTest do
  use Momo.ModelCase

  alias Momo.UserBoard

  @valid_attrs %{}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = UserBoard.changeset(%UserBoard{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = UserBoard.changeset(%UserBoard{}, @invalid_attrs)
    refute changeset.valid?
  end
end
