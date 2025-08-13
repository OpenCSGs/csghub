const getInputTypeForEngineArg = (name, value) => {
  // Parameters that need select/dropdown
  const selectParams = {
    'block-size': ['8', '16', '32', '64', '128'],
    'dtype': ['auto', 'float16', 'bfloat16', 'float', 'float32'],
    'scheduling-policy': ['fcfs', 'priority'],
    'guided-decoding-backend': ['outlines', 'lm-format-enforcer', 'xgrammer'],
    'load-format': [
      'auto',
      'pt',
      'safetensors',
      'npcache',
      'dummy',
      'tensorizer',
      'sharded_state',
      'gguf',
      'bitsandbytes',
      'mistral',
      'runai_streamer'
    ],
    'gpu-memory-utilization': [
      '0.1',
      '0.2',
      '0.3',
      '0.4',
      '0.5',
      '0.6',
      '0.7',
      '0.8',
      '0.9',
      '1'
    ]
  }

  // Parameters that need switches/checkboxes
  const switchParams = [
    'enable-prefix-caching',
    'enable-chunked-prefill',
    'enforce-eager',
    'disable-custom-all-reduce'
  ]

  if (name in selectParams)
    return { type: 'select', options: selectParams[name] }

  if (switchParams.includes(name)) return { type: 'switch' }

  if (value === 'enable' || value === 'disable') return { type: 'switch' }

  // Default to text input
  return { type: 'text' }
}

export default getInputTypeForEngineArg
