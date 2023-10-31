require "administrate/field/base"

class RichTextField < Administrate::Field::Base
  def to_s
    data
  end
end
