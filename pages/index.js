import Head from "next/head"
import Link from "next/link"
import Image from "next/image"
import Date from "../components/Date"
import { getSortedPostsData } from "../lib/posts"

export async function getStaticProps() {
  const allPostsData = getSortedPostsData()

  return {
    props: {
      allPostsData,
    },
  }
}

// getStaticProps는 빌드할 때 화면을 그리는데,
// fetch속의 "http://localhost..."주소는 서버를 띄워놔야 나오기 때문에 에러
// 그래서 getServerSideProps사용
// But, server-side에서는 API Routes를 사용하지 않아야 하기 때문에
// getStaticPosps / getStaticPaths 등은 client-side코드에 포함되지 않는다

// export async function getServerSideProps() {
//   // getStaticProps안에서는 상대경로 쓸 수 없음
//   const response = await fetch("http://localhost:3000/api/posts")
//   const json = await response.json()

//   return {
//     props: {
//       allPostsData: json.allPostsData,
//     },
//   }
// }

export default function Home({ allPostsData }) {
  return (
    <div>
      <Head>
        <title>Blog | Home</title>
      </Head>

      <Image src="/images/profile.jpg" width={150} height={150} alt="belisy" />
      <Link href="/posts/first-post" legacyBehavior>
        <a>첫번째 글</a>
      </Link>

      <Link href="/posts/second-post" legacyBehavior>
        <a>두번째 글</a>
      </Link>

      <section>
        <h2>Blog</h2>
        <ul>
          {allPostsData.map(({ id, date, title }) => (
            <li key={id}>
              <Link href={`/posts/${id}`} legacyBehavior>
                <a>{title}</a>
              </Link>
              <br />
              {id}
              <br />
              <Date dateString={date} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
