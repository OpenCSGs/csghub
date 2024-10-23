import { atob_utf8 } from './utils'

const relativePathToResolvePath = (repoType, content, namespacePath, currentBranch) => {
  if (!content) return content

  const prefix = `/${repoType}/${namespacePath}/resolve/${currentBranch}/`

  // Handle markdown format image
  content = content.replace(
    /\!\[(.*?)\]\((.*?)\)/g,
    (match, altText, imagePath) => {
      if (imagePath.startsWith('http') || imagePath.startsWith(`/${repoType}/`)) {
        return match
      } else {
        return `![${altText}](${prefix}${imagePath})`
      }
    }
  )

  // Handle img tag format image
  content = content.replace(/src=['"]{1}(.*?)['"]{1}/g, (match, src) => {
    if (src.startsWith('http') || src.startsWith(`/${repoType}/`)) {
      return match
    } else {
      return `src="${prefix}${src}"`
    }
  })

  return content
}

const resolveContent = (repoType, encodedContent, namespacePath, currentBranch) => {
  const requestUrl = new URL(window.location.href)
  const fileExtension = requestUrl.pathname.split('.').pop()

  let content

  if (['jpg', 'png', 'jpeg', 'gif', 'svg'].includes(fileExtension)) {
    content = `<img src='${requestUrl.href.replace('blob', 'resolve')}'>`
  } else {
    const parsedBlobContent = atob_utf8(encodedContent)
    try {
      content = relativePathToResolvePath(
        repoType,
        parsedBlobContent,
        namespacePath,
        currentBranch
      )
    } catch (error) {
      console.log(error)
      content = parsedBlobContent
    }
  }

  return content
}

export default resolveContent
