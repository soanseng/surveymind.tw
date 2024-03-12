import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
<section className="my-8">
          <h1 className="text-2xl font-bold">心理健康自我評估平台</h1>
          <p>這是<a href="https://anxiety.com.tw" target="_blank" rel="noopener noreferrer" className="text-blue-300">文心樂丞診所</a>提供一系列的心理健康自我評估問卷，希望幫助使用者更好地了解自己的心理狀態。</p>
        </section>
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
          <Card  className="p-4 shadow rounded">
            <CardHeader>
              <CardTitle >醫學</CardTitle>
              <CardDescription>這是一個醫學上常見的自我評估量表</CardDescription>
            </CardHeader>
            <CardContent>
            <Image src="/images/q1.jpg" alt="q1" width={500} height={500} />
            </CardContent>
            </Card>

          <Card  className="p-4 shadow rounded">
            <CardHeader>
              <CardTitle >實證</CardTitle>
              <CardDescription>每個量表都有良好的信效度</CardDescription>
            </CardHeader>
            <CardContent>
            <Image src="/images/q2.jpg" alt="q1" width={500} height={500} />
            </CardContent>
            </Card>

          <Card  className="p-4 shadow rounded">
            <CardHeader>
              <CardTitle >自我評估</CardTitle>
              <CardDescription>快速評估是否需要協助</CardDescription>
            </CardHeader>
            <CardContent>
            <Image src="/images/q3.jpg" alt="q1" width={500} height={500} />
            </CardContent>
            </Card>
        </section>
        <section className="my-8">
          <h2 className="text-xl font-semibold">關於我們</h2>
          <p>我是陳璿丞醫師，希望透過這個簡單的網站，讓更多人能夠快速地自我評估。</p>
          <p>這些自我評估問卷不能取代專業的診斷和治療。如果您在問卷中發現任何令人擔憂的結果，我們強烈建議您尋求專業醫療人員的幫助。</p>
          <p>開始您的自我探索之旅，並為自己的心理健康投資。立即選擇一份問卷，開始評估！。</p>
        </section>
    </main>
  );
}
