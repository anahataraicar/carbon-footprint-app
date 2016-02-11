class CreateProfiles < ActiveRecord::Migration
  def change
    create_table :profiles do |t|
      t.integer :user_id
      t.decimal :total_value, precision: 8, scale: 2

      t.timestamps 
    end
  end
end
