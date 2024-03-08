import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
<section className="my-8">
          <h1 className="text-2xl font-bold">心理健康自我評估平台</h1>
          <p>在這個平台上，我們提供一系列的心理健康自我評估問卷，希望幫助使用者更好地了解自己的心理狀態。</p>
        </section>
        <section className="grid grid-cols-3 gap-4 my-8">
          <div className="p-4 shadow rounded">Q1</div>
          <div className="p-4 shadow rounded">Q2</div>
          <div className="p-4 shadow rounded">Q3</div>
        </section>
        <section className="my-8">
          <h2 className="text-xl font-semibold">關於我們</h2>
          <p>我們是一群致力於心理健康領域的專業人士，希望透過這個平台，讓更多人能夠輕鬆存取心理健康資源。</p>
          <p>這些自我評估問卷不能取代專業的診斷和治療。如果您在問卷中發現任何令人擔憂的結果，我們強烈建議您尋求專業醫療人員的幫助。</p>
          <p>開始您的自我探索之旅，並為自己的心理健康投資。立即選擇一份問卷，開始評估！。</p>
        </section>
    </main>
  );
}
