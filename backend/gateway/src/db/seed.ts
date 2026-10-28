import type { FaqItem, ResearchArticle } from "./types";

/**
 * Initial content, copied from frontend/src/content/{faq,research}.ts. It is inserted once into an
 * empty table; after that the database is the source of truth.
 */
export const faqSeed: FaqItem[] = [
  { id: "different-from-mri", question: "How is Braincize different from a regular MRI ?",
    answer:
      "A regular MRI is read by a radiologist. Braincize adds an AI layer on top of the scan you already have: it measures brain volume and flags early atrophy that is hard to see by eye, then summarises it in a clear report. It doesn’t replace your MRI or your doctor; it gives them more to work with." },
  { id: "who-should-use", question: "Who should consider using Braincize ?",
    answer:
      "Anyone concerned about brain health: athletes and veterans with a history of head impact, people with a family history of neurodegenerative disease, and patients or clinicians who want a second, quantitative look at an MRI. Results are informational and should always be discussed with a medical professional." },
  { id: "safe-for-everyone", question: "Is Braincize safe for everyone to use?",
    answer:
      "Yes. Braincize analyses scans you upload, so there is no new imaging or radiation involved. Uploads are encrypted in transit and you must be 18 or older to use the platform. The analysis is not a diagnosis, and it isn’t a substitute for professional medical advice." },
  { id: "time-to-results", question: "How long does it take to see results with Braincize ?",
    answer:
      "Most scans are analysed within a minute. Larger batches, or videos that are split into many frames, take a little longer because each image is processed separately. You can follow progress on the page while it runs." },
];

export const researchSeed: ResearchArticle[] = [
  { id: "cortical-atrophy-nfl", title: "CORTICAL ATROPHY IN NFL PLAYERS WITH CONCUSSION ON CONVENTIONAL MRI BRAIN IMAGING" },
  { id: "imaging-mtbi-concussion", title: "IMAGING OF MILD TRAUMATIC BRAIN INJURY CONCUSSION" },
  { id: "routine-mri-utilization", title: "UTILIZATION OF ROUTINE MRI" },
  { id: "encephalopathy-aids", title: "ENCEPHALOPATHY IN AIDS PATIENTS: Evaluation with MR Imaging" },
  { id: "skull-base-lesions", title: "MR EVALUATION OF SKULL BASE LESIONS" },
];
