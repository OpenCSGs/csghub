class AddBacktraceToErrorLog < ActiveRecord::Migration[7.0]
  def change
    add_column :error_logs, :backtrace, :text
  end
end
