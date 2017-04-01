defmodule Momo.UserChannel do
  use Momo.Web, :channel

  def join("users:" <> user_id, _params, socket) do
    {:ok, socket}
  end
end
