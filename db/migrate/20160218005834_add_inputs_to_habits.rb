class AddInputsToHabits < ActiveRecord::Migration
  def change
    add_column :habits, :input1, :decimal, precision: 8, scale: 2, null: true
    add_column :habits, :input2, :decimal, precision: 8, scale: 2, null: true
    add_column :habits, :input3, :decimal, precision: 8, scale: 2, null: true
  end
end
