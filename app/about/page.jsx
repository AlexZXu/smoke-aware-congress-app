"use client"

import PageWrapper from "../PageWrapper";
import React from "react";
export default function AboutPage() {
    return (
        <PageWrapper currType={"about"}>
            <div className="w-full bg-slate-950 rounded-xl shadow shadow-slate-400/35 flex flex-col items-center justify-center p-5 font-bold border border-slate-900 h-full">
                <div className="text-lg">
                This app was made by Alexander Xu. Email me: xualex008@gmail.com!
                </div>
                
                <div className="font-medium text-slate-200 text-center p-6">
                    Smoke Aware’s purpose is to make data on pollution and wildfire smoke more accessible and understandable to a wider audience through a user-friendly web app and tools like artificial intelligence. 
                    This matters because research has shown that wildfires today have been directly exacerbated by climate change. Millions of people are affected annually by harmful smoke inhalation. 
                    Smoke Aware aims to help raise public awareness about these issues to help keep people safe and track important climate trends.
                </div>
                
                <div className="font-medium">
                    This app uses APIs from Google Maps and OpenAI.
                </div>
            </div>
        </PageWrapper>
    )
}
