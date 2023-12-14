class Model < ApplicationRecord
  enum :visibility, { model_public: 'public', model_private: 'private' }, default: :model_private
  enum :license, {
    apache: 'Apache License 2.0',
    mit: 'MIT License',
    gpl: 'GNU General Public License',
    gpl3: 'GNU General Public License v3.0',
    gpl2: 'GNU General Public License v2.0',
    agpl3: 'GNU Affero Public License v3.0',
    agpl2: 'GNU Affero Public License v2.0',
    lgpl3: 'GNU Lesser General Public License v3.0',
    lgpl2: 'GNU Lesser General Public License v2.1',
    bsd2: 'BSD 2-Clause License',
    bsd3: 'BSD 3-Clause License',
    mpl2: 'Mozilla Public License v2.0',
    mpl3: 'Mozilla Public License v3.0',
    epl2: 'Eclipse Public License v2.0',
    epl3: 'Eclipse Public License v3.0',
    cc0: 'CC0 1.0 Universal License',
    other: 'Other'
  }

  belongs_to :owner, polymorphic: true

  validates :name, format: { with: /\A(?=.{2,20}$)(?!.*[_]{2})(?!.*[-]{2})[a-zA-Z0-9_-]+\Z/ }

  def path
    "#{owner.name}/#{name}"
  end
end
