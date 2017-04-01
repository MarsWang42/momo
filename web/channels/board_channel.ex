defmodule Momo.BoardChannel do
  use Momo.Web, :channel
  alias Momo.{User, Board, UserBoard, List, Task, ArchivedTask, ArchivedList}
  alias Momo.BoardChannel.Monitor

  def join("boards:" <> board_id, _params, socket) do
    current_user = socket.assigns.current_user
    board = get_current_board(socket, board_id)

    Monitor.create(board_id)

    send(self, {:after_join, Monitor.user_joined(board_id, current_user.id)})

    case board do
      nil ->
        {:error, %{error: "Cannot find the board"}}
      _ ->
        {:ok, %{board: board}, assign(socket, :board, board)}
    end
  end

  def terminate(_reason, socket) do
    user_id = socket.assigns.current_user.id
    board_id = Integer.to_string(socket.assigns.board.id)

    broadcast! socket, "user:left", %{users: Monitor.user_left(board_id, user_id)}
  end

  def handle_info({:after_join, connected_users}, socket) do
    broadcast! socket, "user:joined", %{users: connected_users}

    {:noreply, socket}
  end

  def handle_in("members:add", %{"email" => email}, socket) do
    try do
      board = socket.assigns.board
      user = User
        |> Repo.get_by(email: email)

      changeset = user
      |> build_assoc(:user_boards)
      |> UserBoard.changeset(%{board_id: board.id})

      case Repo.insert(changeset) do
        {:ok, _board_user} ->
          broadcast! socket, "member:added", %{user: user}

          Momo.Endpoint.broadcast_from! self(), "users:#{user.id}", "boards:add", %{board: board}

          {:noreply, socket}
        {:error, _changeset} ->
          {:reply, {:error, %{error: "Error adding new member"}}, socket}
      end
    catch
      _, _-> {:reply, {:error, %{error: "User does not exist"}}, socket}
    end
  end

  def handle_in("lists:create", %{"list" => list_params}, socket) do
    board = socket.assigns.board

    changeset = board
      |> build_assoc(:lists)
      |> List.changeset(list_params)

    case Repo.insert(changeset) do
      {:ok, list} ->
        list = Repo.preload(list, [:board, :tasks])

        broadcast! socket, "list:created", %{list: list}
        {:noreply, socket}
      {:error, _changeset} ->
        {:reply, {:error, %{error: "Error creating list"}}, socket}
    end
  end

  def handle_in("list:update", %{"list" => list_params}, socket) do
    list = socket.assigns.board
      |> assoc(:lists)
      |> Repo.get!(list_params["id"])

    changeset = List.update_changeset(list, list_params)

    case Repo.update(changeset) do
      {:ok, _list} ->
        board = get_current_board(socket)
        broadcast! socket, "list:updated", %{board: board}
        {:noreply, socket}
      {:error, _changeset} ->
        {:reply, {:error, %{error: "Error updating list"}}, socket}
    end
  end

  def handle_in("list:archive", %{"id" => list_id}, socket) do
    list = socket.assigns.board
      |> assoc(:lists)
      |> Repo.get!(list_id)

    current_user = socket.assigns.current_user

    board = socket.assigns.board
    changeset = board
      |> build_assoc(:archived_lists)
      |> ArchivedList.changeset(%{
        title: list.title,
        original_id: list.id,
        user_id: current_user.id
      })

    Repo.delete(list)

    case Repo.insert(changeset) do
      {:ok, archived_list} ->
        broadcast! socket, "list:archived", %{archived_list: archived_list}
        {:noreply, socket}
      {:error, _changeset} ->
        {:reply, {:error, %{error: "Error archiving list"}}, socket}
    end
  end

  def handle_in("tasks:create", %{"task" => task_params}, socket) do
    board = socket.assigns.board
    current_user = socket.assigns.current_user
    changeset = board
      |> assoc(:lists)
      |> Repo.get!(task_params["list_id"])
      |> build_assoc(:tasks)
      |> Task.changeset(%{
        title: task_params["title"],
        user_id: current_user.id
      })

    case Repo.insert(changeset) do
      {:ok, task} ->
        task = board
          |> assoc(:tasks)
          |> Repo.get!(task.id)
          |> Repo.preload([:user])

        broadcast! socket, "task:created", %{task: task}
        {:noreply, socket}
      {:error, _changeset} ->
        {:reply, {:error, %{error: "Error creating task"}}, socket}
    end
  end

  def handle_in("task:update", %{"task" => task_params}, socket) do
    task = socket.assigns.board
      |> assoc(:tasks)
      |> Repo.get!(task_params["id"])

    changeset = Task.update_changeset(task, task_params)

    case Repo.update(changeset) do
      {:ok, task} ->
        board = get_current_board(socket)

        task = Task
        |> Repo.get(task.id)
        |> Repo.preload([:user])

        broadcast! socket, "task:updated", %{board: board, task: task}
        {:noreply, socket}
      {:error, _changeset} ->
        {:reply, {:error, %{error: "Error updating task"}}, socket}
    end
  end

  def handle_in("task:archive", %{"id" => task_id}, socket) do
    task = socket.assigns.board
      |> assoc(:tasks)
      |> Repo.get!(task_id)

    current_user = socket.assigns.current_user

    board = socket.assigns.board
    changeset = board
      |> build_assoc(:archived_tasks)
      |> ArchivedTask.changeset(%{
        title: task.title,
        original_id: task.id,
        description: task.description,
        list_id: task.list_id,
        user_id: current_user.id
      })

    Repo.delete(task)

    case Repo.insert(changeset) do
      {:ok, archived_task} ->
        archived_task = Repo.preload(archived_task, [:user])

        broadcast! socket, "task:archived", %{archived_task: archived_task}
        {:noreply, socket}
      {:error, _changeset} ->
        {:reply, {:error, %{error: "Error archiving task"}}, socket}
    end
  end

  def handle_in("archived_tasks:fetch", _params, socket) do
    archived_tasks = socket.assigns.board
      |> assoc(:archived_tasks)
      |> Repo.all
      |> Repo.preload([:user])

    broadcast! socket, "archived_tasks:fetched", %{archived_tasks: archived_tasks}
    {:noreply, socket}
  end

  defp get_current_board(socket, board_id) do
    socket.assigns.current_user
    |> assoc(:boards)
    |> Board.preload_all
    |> Repo.get(board_id)
  end

  defp get_current_board(socket), do: get_current_board(socket, socket.assigns.board.id)
end
