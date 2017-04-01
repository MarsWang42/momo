defmodule Momo.PageController do
  use Momo.Web, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
