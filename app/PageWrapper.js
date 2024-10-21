import Link from "next/link"
import Image from "next/image"

export default function PageWrapper({children, currType}) {
    return (
        <main className="min-h-screen min-w-screen">
            <div className="flex flex-row w-full outline">
                <div className="flex flex-col w-[290px] h-screen border-r-2 border-slate-600 shrink-0 p-8 text-xl gap-5 text-slate-300 font-semibold pt-10 justify-between pb-24">
                    <div className="flex flex-col gap-5">
                        <div className="flex items-center gap-2 text-2xl text-slate-400 mb-8">
                            <Image src="/smoke-aware-logo.png" width={45} height={45} alt="smoke-aware-logo"/>
                            Smoke Aware
                        </div>
                        <Link href="/" className={`${currType == "around" ? "text-violet-300" : "hover:text-violet-200 transition-colors duration-150"}`}>Around You</Link>
                        <Link href="/summary" className={`${currType == "summary" ? "text-violet-300" : "hover:text-violet-200 transition-colors duration-150"}`}>Daily Summary</Link>
                        <Link href="/smoke" className={`${currType == "smoke" ? "text-violet-300" : "hover:text-violet-200 transition-colors duration-150"}`}>Smoke Monitoring</Link>
                        <Link href="/fetch" className={`${currType == "fetch" ? "text-violet-300" : "hover:text-violet-200 transition-colors duration-150"}`}>Fetch and Export</Link>
                        <Link href="/ai" className={`${currType == "ai" ? "text-violet-300" : "hover:text-violet-200 transition-colors duration-150"}`}>Analyze with AI</Link>
                    </div>
                    <Link href="/about" className={`${currType == "about" ? "text-violet-300" : "hover:text-violet-200 transition-colors duration-150"}`}>About Smoke Aware</Link>
                </div>
                <div className="flex flex-col w-full max-w-full min-w-0 min-h-0 h-screen items-center gap-4 shrink-1 p-8 relative">
                    {children}
                </div>
            </div>
        </main>
    )
}