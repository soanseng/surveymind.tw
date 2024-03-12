import Link from 'next/link'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
 
export default function NotFound() {
  return (
    <Card className="max-w-lg w-full mx-auto">
        <CardHeader>
            <CardTitle>
            本頁施工中  🚧
            </CardTitle>
            </CardHeader>
        <CardContent>
            <div className='flex'>
                請再給我一些些時間，讓我可以完成
            </div>

        </CardContent>
      
      <CardFooter className='flex justify-between'>
      <Button><Link href="/">回到首頁</Link></Button>
      </CardFooter>
    </Card>
  )
}