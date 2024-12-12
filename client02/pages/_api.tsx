import type { AppProps } from "next/app";

export default function MyApp({Component, PageProps} : AppProps){
    return <Component {...PageProps} />
}