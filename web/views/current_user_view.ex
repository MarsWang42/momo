defmodule Momo.CurrentUserView do
  use Momo.Web, :view

  def render("show.json", %{user: user}) do
    user
  end

  def render("error.json", _) do
  end
end
