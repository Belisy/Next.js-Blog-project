import { MDXRemote } from "next-mdx-remote"
import Head from "next/head"
import Date from "../../components/Date"
import Layout from "../../components/Layout"
import { getAllPostIds, getPostData } from "../../lib/posts"
import CodeBlock from "../../components/CodeBlock"
import Link from "next/link"
import Utterances from "../../components/Utterances"

export async function getStaticPaths() {
  const paths = getAllPostIds()
  return {
    paths,
    fallback: "blocking",
  }
}

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.id)
  return {
    props: {
      postData,
    },
  }
}

const Button = ({ children }) => {
  return (
    <button onClick={() => alert(`thanks to ${children}!`)}>{children}</button>
  )
}
const components = { Button, CodeBlock }
console.log("components?", components)

export default function Post({ postData }) {
  return (
    <Layout>
      <Head>
        <title>Blog | Post</title>
      </Head>
      {postData?.title}
      <br />
      {postData?.id}
      <br />
      <Date dateString={postData?.date} />
      <br />
      {postData.contentHtml && (
        <div dangerouslySetInnerHTML={{ __html: postData?.contentHtml }} />
      )}
      {postData.mdxSource && (
        <MDXRemote {...postData.mdxSource} components={components} />
      )}
      <br />
      <Utterances />
      <Link href={"/"} legacyBehavior>
        <a>홈으로</a>
      </Link>
    </Layout>
  )
}
