import { atob_utf8 } from './utils'

const relativePathToResolvePath = (
  repoType,
  content,
  namespacePath,
  currentBranch,
  requestPath
) => {
  if (!content) return content

  let repoBasePath = `/${repoType}/${namespacePath}`

  if (repoType === 'mcps') {
    repoBasePath = `/mcp/servers/${namespacePath}`
  }

  let prefix = `/${repoType}/${namespacePath}/resolve/${currentBranch}/`

  // requestPath === repoBasePath means accessing repo summary page
  // requestPath !== repoBasePath means accessing a file
  if (requestPath !== repoBasePath) {
    const lastSlashIndex = requestPath.lastIndexOf('/')
    const pathWithoutFilename = requestPath.substring(0, lastSlashIndex + 1)
    prefix = pathWithoutFilename.replace('/blob/', '/resolve/')
    if (repoType === 'mcps') {
      prefix = prefix.replace('/mcp/servers', '/mcps')
    }
  }

  // Handle markdown format image
  content = content.replace(
    /\!\[(.*?)\]\((.*?)\)/g,
    (match, altText, imagePath) => {
      if (
        imagePath.startsWith('http') ||
        imagePath.startsWith(`/${repoType}/`)
      ) {
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

const resolveContent = (
  repoType,
  encodedContent,
  namespacePath,
  currentBranch,
  currentPath,
  fileExtension
) => {
  let content

  if (['jpg', 'png', 'jpeg', 'gif', 'svg'].includes(fileExtension)) {
    content = `<img src='/${repoType}/${namespacePath}/resolve/${currentBranch}/${currentPath}'/>`
  } else {
    const parsedBlobContent = atob_utf8(encodedContent)
    try {
      content = relativePathToResolvePath(
        repoType,
        parsedBlobContent,
        namespacePath,
        currentBranch,
        currentPath
      )
    } catch (error) {
      console.log(error)
      content = parsedBlobContent
    }
  }

  return content
}

export default resolveContent
