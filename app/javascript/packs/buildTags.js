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
    default:
      tagCategories.other_tags.push(tag)
      break
  }
}

export const buildTags = (tags) => {
  const tagCategories = {
    task_tags: [],
    framework_tags: [],
    language_tags: [],
    license_tags: [],
    industry_tags: [],
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
