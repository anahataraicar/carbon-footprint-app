class CreateHabits < ActiveRecord::Migration
  def change
    create_table :habits do |t|
      t.integer :user_id
      t.integer :profile_id
      t.string :footprint_type
      t.decimal :value, precision: 8, scale: 2

      t.timestamps 
    end
  end
end
