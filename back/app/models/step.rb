class Step < ApplicationRecord
  belongs_to :recipe

  validates :step_number, presence: true, numericality: { only_integer: true, greater_than: 0 }
  validates :instruction, presence: true
end
