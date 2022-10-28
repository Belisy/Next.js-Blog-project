import { useRef, useState } from "react"
import Layout from "../../components/Layout"
import Link from "next/link"

export default function Write() {
  const idRef = useRef(null)
  const titleRef = useRef(null)
  const contentRef = useRef(null)

  const [showLink, setShowLink] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()

    const id = idRef.current.value
    const title = titleRef.current.value
    const content = contentRef.current.value

    if (id && title && content) {
      // fetch() promise는 HTTP error에 의해 reject되지 않는다
      // 그래서 if문으로 직접 성공할 경우와 실패할 경우를 적어줘야 한다
      fetch("/api/post/write", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          title,
          content,
        }),
      })
        .then((res) => {
          if (res.ok) {
            console.log(res.json, "res", res)
            return res.json()
          }
          throw new Error("Fetch Error")
        })
        .then((data) => {
          setShowLink(true)
          alert(data.message)
        })
        .catch((err) => alert(`request error: ${error}`))
    }
  }

  return (
    <Layout>
      <h1>Write a post</h1>
      <form onSubmit={handleSubmit}>
        <input ref={idRef} type="text" name="id" placeholder="id" required />
        <br />
        <input
          ref={titleRef}
          type="text"
          name="title"
          placeholder="title"
          required
        />
        <br />
        <textarea
          ref={contentRef}
          type="text"
          name="content"
          placeholder="content"
          required
        />
        <br />
        <input type="submit" value="Create" />
      </form>
      {showLink && (
        <Link href={`/posts/${idRef.current.value}`} legacyBehavior>
          <a>Created Post</a>
        </Link>
      )}
    </Layout>
  )
}
