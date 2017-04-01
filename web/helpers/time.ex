defmodule Momo.TimeHelpers do
  use Timex
  alias Timex.DateTime

  @moduledoc """
  Helpers for DateTime display
  """

  @doc """
  Generates approximate distance of time between two times in words.
  """
  def distance_of_time_in_words(from_time, to_time \\ DateTime.now) do
    case from_time > to_time do
      true ->
        from = to_time
        to = from_time
      false ->
        from = from_time
        to = to_time
    end
    distance_in_seconds = abs(DateTime.to_seconds(to_time) - DateTime.to_seconds(from_time))
    distance_in_minutes = abs(round(distance_in_seconds / 60.0))

    words = case distance_in_minutes do
      n when n in 0..1 ->
        "Less than 1 minute"
      n when n in 2..45 ->
        "#{n} minutes"
      n when n in 45..90 ->
        "about 1 hour"
      n when n in 90..1440 ->
        "about #{round(n / 60.0)} hours"
      n when n in 1440..2520 ->
        "about 1 day"
      n when n in 2520..43200 ->
        "about #{round(n / 1440.0)} days"
      n when n in 43200..86400 ->
        "about #{round(n / 43200.0)} months"
      n when n in 86400..525600 ->
        "#{round(n / 43200.0)} months"
      _ -> "a long time"
    end
    words
  end
end
