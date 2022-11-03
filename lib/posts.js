import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { remark } from "remark"
import html from "remark-html"
import { serialize } from "next-mdx-remote/serialize"

// fs를 사용하는 이 함수는 서버사이드에서만 사용할 수 있다
// precess.cwd(): 루트경로
// eslint-disable-next-line no-undef
const postsDirectory = path.join(process.cwd(), "posts")

export function getSortedPostsData() {
  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = fileNames.map((fileName) => {
    const id = fileName.replace(/\.md$|\.mdx$/, "") // '.md'제거한 파일이름
    const fullPath = path.join(postsDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, "utf8") // 파일읽기
    const matterResult = matter(fileContents)

    return {
      id,
      ...matterResult.data, // 파일의 내용
    }
  })

  return allPostsData.sort(({ date: a }, { date: b }) => {
    if (a < b) {
      return 1
    } else if (a > b) {
      return -1
    } else {
      return 0
    }
  })
}

export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory)

  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$|\.mdx$/, ""),
      },
    }
  })
}

export async function getPostData(id) {
  const fullMdPath = path.join(postsDirectory, `${id}.md`)
  const mdExist = fs.existsSync(fullMdPath)

  if (mdExist) {
    const fullPath = path.join(postsDirectory, `${id}.md`)
    const fileContents = fs.readFileSync(fullPath, "utf8")

    const matterResult = matter(fileContents)

    const processedContent = await remark()
      .use(html)
      .process(matterResult.content)
    const contentHtml = processedContent.toString()

    return {
      id,
      contentHtml,
      ...matterResult.data,
    }
  } else {
    const fullPath = path.join(postsDirectory, `${id}.mdx`)
    const fileContents = fs.readFileSync(fullPath, "utf8")

    const matterResult = matter(fileContents)

    const mdxSource = await serialize(matterResult.content)

    return {
      id,
      mdxSource,
      ...matterResult.data,
    }
  }
}

export async function createPost({ id, title, date, content }) {
  const fullPath = path.join(postsDirectory, `${id}.md`)

  const data = `---
  title: '${title}'
  date: '${date}'
---

  ${content}`

  fs.writeFileSync(fullPath, data)
}
