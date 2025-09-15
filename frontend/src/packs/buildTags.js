const handleTag = (tag, tagCategories) => {
  switch (tag.category) {
    case 'task':
      tagCategories.task_tags.push(tag)
      break
    case 'framework':
      tagCategories.framework_tags.push(tag)
      break
    case 'license':
      tagCategories.license_tags.push(tag)
      break
    case 'language':
      tagCategories.language_tags.push(tag)
      break
    case 'industry':
      tagCategories.industry_tags.push(tag)
      break
    case 'program_language':
      tagCategories.program_language_tags.push(tag)
      break
    case 'runmode':
      tagCategories.runmode_tags.push(tag)
      break
    case 'scene':
      tagCategories.scene_tags.push(tag)
      break
    case 'hardware':
      tagCategories.hardware_tags.push(tag)
      break
    case 'sdk':
      tagCategories.sdk_tags.push(tag)
      break
    default:
      tagCategories.other_tags.push(tag)
      break
  }
}

// 字段处理器配置
const fieldProcessors = {
  space: {
    license: (value) => ({
      name: value,
      category: 'license',
      built_in: true
    }),
    sdk: (value) => ({
      name: value,
      category: 'sdk',
      built_in: true
    }),
    hardware: (value) => {
      try {
        const hardwareData = typeof value === 'string' ? JSON.parse(value) : value
        
        let hardwareText = ''
        if (hardwareData.cpu) {
          const cpuNum = hardwareData.cpu.num || '1'
          hardwareText += `CPU ${cpuNum} vCPU`
        }
        if (hardwareData.memory) {
          if (hardwareText) hardwareText += ' · '
          hardwareText += hardwareData.memory
        }
        
        return hardwareText ? {
          name: hardwareText,
          category: 'hardware',
          built_in: true
        } : null
      } catch (error) {
        console.warn('Failed to parse hardware data:', error)
        return null
      }
    }
  }
  // 可以在这里添加其他仓库类型的处理器
  // model: { ... },
  // dataset: { ... }
}

// 处理特定仓库类型的特殊字段
const handleSpecialFields = (repoData, tagCategories) => {
  const repoType = repoData.repoType
  const processors = fieldProcessors[repoType]
  
  if (!processors) return
  
  Object.entries(processors).forEach(([fieldName, processor]) => {
    const fieldValue = repoData[fieldName]
    if (fieldValue) {
      const tag = processor(fieldValue)
      if (tag) {
        const categoryKey = `${tag.category}_tags`
        if (tagCategories[categoryKey]) {
          tagCategories[categoryKey].push(tag)
        }
      }
    }
  })
}

export const buildTags = (repoData) => {
  if (!repoData) return

  const tagCategories = {
    task_tags: [],
    framework_tags: [],
    language_tags: [],
    license_tags: [],
    industry_tags: [],
    program_language_tags: [],
    runmode_tags: [],
    scene_tags: [],
    hardware_tags: [],
    sdk_tags: [],
    other_tags: []
  }

  // 处理 tags 数组
  if (repoData.tags && repoData.tags.length) {
    repoData.tags.forEach((tag) => {
      if (!tag.built_in) {
        tagCategories.other_tags.push(tag)
        return
      }

      handleTag(tag, tagCategories)
    })
  }

  // 处理特定仓库类型的特殊字段
  handleSpecialFields(repoData, tagCategories)

  return tagCategories
}
