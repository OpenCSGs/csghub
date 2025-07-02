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
    default:
      tagCategories.other_tags.push(tag)
      break
  }
}

export const buildTags = (tags) => {
  if (!tags) return

  const tagCategories = {
    task_tags: [],
    framework_tags: [],
    language_tags: [],
    license_tags: [],
    industry_tags: [],
    program_language_tags: [],
    runmode_tags: [],
    scene_tags: [],
    other_tags: []
  }

  if (!tags || !tags.length) return tagCategories

  tags.forEach((tag) => {
    if (!tag.built_in) {
      tagCategories.other_tags.push(tag)
      return
    }

    handleTag(tag, tagCategories)
  })

  return tagCategories
}
