EXPERTS = YAML.safe_load(File.read(File.join(Rails.root, 'config/experts.yml')))
PARTNERS = YAML.safe_load(File.read(File.join(Rails.root, 'config/partners.yml')))
MODELS = YAML.safe_load(File.read(File.join(Rails.root, 'config/models.yml')))
DATASETS = YAML.safe_load(File.read(File.join(Rails.root, 'config/datasets.yml')))
LANDING_PAGE = YAML.safe_load(File.read(File.join(Rails.root, 'config/landing_page.yml')))
COLORS = [
'#6b9023',
'#006666',
'#3d5c5c',
'#26734d',
'#267326',
'#999900',
'#77773c',
'#8a8a5c',
'#739900',
'#b30059',
'#990099',
'#7700b3',
'#0000b3',
'#5c5cd6',
'#666699',
'#6b00b3',
'#cc2900',
'#990033',
'#993333',
'#0059b3',
'#03c9ab',
'#b3ad00',
'#58852e',
'#62a02c',
'#02afe3'
]
