defmodule Momo.BoardView do
  use Momo.Web, :view

  def render("index.json", %{owned_boards: owned_boards, invited_boards: invited_boards}) do
    list_owned_boards = Enum.map(owned_boards, fn board -> %{
      title: board.title,
      id: board.id,
      user: board.user
    } end)
    list_invited_boards = Enum.map(invited_boards, fn board -> %{
      title: board.title,
      id: board.id,
      user: board.user
    } end)
    %{
      owned_boards: list_owned_boards,
      invited_boards: list_invited_boards
    }
  end

  def render("show.json", %{board: board}) do
    %{
      id: board.id,
      title: board.title,
      user_id: board.user_id
    }
  end

  def render("error.json", %{changeset: changeset}) do
    errors = Enum.map(changeset.errors, fn {field, detail} ->
      %{} |> Map.put(field, detail)
    end)

    %{
      errors: errors
    }
  end
end
