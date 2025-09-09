import HomePage from "@/shared/components/Home/Homepage"
import WhatIsBraincize from "@components/Home/WhatIsBraincize"
import KeyFeatures from "@components/Home/KeyFeatures"
import { FaqQuestions } from "@/shared/components/Faq/FaqQuestions"
import TestimonialPage from "@/shared/components/Home/Testimonial"
import { Spotlight } from "@/shared/components/Home/Spotlight"
export default async function App(){
  return <>
    <HomePage />
    <WhatIsBraincize />
    <KeyFeatures />
    <Spotlight />
    <TestimonialPage />
    <FaqQuestions />
  </>
}
