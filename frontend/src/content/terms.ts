export interface TermsSection {
  title: string;
  body: string[];
  /** Position on mobile, where "Intellectual Property" comes first. */
  mobileOrder: number;
}

export const termsIntro = {
  title: "Terms of Service & Legal Disclaimer",
  body: [
    "Welcome to Braincize.com — an AI-powered neuroimaging diagnostic platform designed to predict brain volume loss in conditions such as mild traumatic brain injury (mTBI), chronic traumatic encephalopathy (CTE), and other neurodegenerative diseases.",
    "By accessing or using this site, you agree to be bound by the terms below",
  ],
};

export const termsSections: TermsSection[] = [
  {
    title: "Intellectual Property",
    body: [
      "All materials on this site — including images, text, logos, documents, downloadable files, and diagnostic tools — are the exclusive property of Dr. Calvin Hubert Flowers, MD. Unauthorized use or distribution is strictly prohibited.",
    ],
    mobileOrder: 0,
  },
  {
    title: "Age Restriction",
    body: [
      "You must be at least 18 years old to use Braincize. By accessing our platform, you confirm that you meet this age requirement. We do not take responsibility for misrepresentation of age.",
    ],
    mobileOrder: 2,
  },
  {
    title: "Limitation of Liability",
    body: [
      "Braincize and its associates (including Dr. Calvin Flowers) are not liable for any damages, losses, or legal claims arising from your use of the site or reliance on its results. The AI analysis is informational and should not replace professional medical consultation.",
    ],
    mobileOrder: 3,
  },
  {
    title: "Indemnity",
    body: [
      "By using this platform, you agree to hold harmless and indemnify Braincize, Dr. Calvin Flowers, and affiliated parties from any legal claims resulting from your use or misuse of the site.",
    ],
    mobileOrder: 4,
  },
  {
    title: "Governing Law",
    body: ["These terms are governed by the laws of the State of Illinois, US"],
    mobileOrder: 5,
  },
  {
    title: "Severability",
    body: ["If any part of these Terms is found invalid under applicable law, the rest will still apply."],
    mobileOrder: 6,
  },
  {
    title: "Updates",
    body: [
      "These Terms may change periodically to stay compliant with the law or to reflect new features. Major updates will be posted here or shared via email.",
    ],
    mobileOrder: 7,
  },
];
