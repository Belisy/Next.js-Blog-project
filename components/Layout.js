import React, { useEffect, useState } from "react"
import Image from "next/image"
import styles from "./layout.module.css"
import dark from "../public/images/dark_mode.svg"
import light from "../public/images/light_mode.svg"

export default function Layout({ children }) {
  const [theme, setTheme] = useState("")
  const [test, setTest] = useState()

  useEffect(() => {
    setTheme(localStorage.getItem("theme"))
    setTest(() => (localStorage.getItem("theme") === "dark" ? light : dark))
  }, [theme])

  useEffect(() => {
    if (theme === "dark") {
      document.querySelector("body").classList.add("dark")
    } else {
      document.querySelector("body").classList.remove("dark")
    }
  }, [theme])

  const handleClick = () => {
    if (theme === "dark") {
      setTheme("light")
      setTest(dark)
      localStorage.setItem("theme", "light")
    } else {
      setTheme("dark")
      setTest(light)
      localStorage.setItem("theme", "dark")
    }
  }

  return (
    <div className="bg-pink-50 dark:bg-black text-gray-800 dark:text-gray-200 h-screen">
      <button className="w-12 px-2" onClick={handleClick}>
        <Image
          className={`fill-yellow`}
          src={test}
          width={36}
          height={36}
          alt={`${theme}모드`}
        />
      </button>
      <div className={styles.container}>{children}</div>
    </div>
  )
}
