import type { NewCategory, NewModel } from "../db/types";

export interface RegistrySeed {
  categories: NewCategory[];
  models: NewModel[];
}

interface PythonUrls {
  /** Base URL of brain.py, e.g. https://127.0.0.1:4000 */
  brainUrl: string;
  /** Base URL of braincize.py, e.g. http://127.0.0.1:8002 */
  braincizeUrl: string;
  /** Accept brain.py's self-signed certificate. */
  insecureTls: boolean;
}

const IMAGES = ["image/jpeg", "image/png"];
const NOT_MRI = { when: "The image is not recognised as a brain MRI", example: { message: "image received. image is not a brain mri" } };
const FAILED = { when: "The image could not be decoded or processing failed", example: { message: "image received. Error Processing Image" } };

/** Size bands used by /predictsz and /predictyolo: <= 50 small, >= 150 large, otherwise medium. */
const sized = (small: number, medium: number, large: number) => [
  NOT_MRI,
  { when: "No sizable shrinkage found", example: { message: "image received. prediction completed no sizable shrinkage found", value: 0 } },
  { when: "Largest shrinkage is 50 or less", example: { message: `image received. Small autrophy detected with value ${small}mm²`, value: small } },
  { when: "Largest shrinkage is between 51 and 149", example: { message: `image received. Medium autrophy detected with value ${medium}mm²`, value: medium } },
  { when: "Largest shrinkage is 150 or more", example: { message: `image received. Large autrophy detected with value ${large}mm²`, value: large } },
  FAILED,
];

/**
 * The endpoints of backend/brain.py and backend/braincize.py exactly as they behave today, and the
 * answers each one can give (read from the scripts). Keep this in step if those scripts change.
 */
export function pythonRegistrySeed({ brainUrl, braincizeUrl, insecureTls }: PythonUrls): RegistrySeed {
  const brain = (path: string) => new URL(path, brainUrl).toString();
  const braincize = (path: string) => new URL(path, braincizeUrl).toString();
  const tls = (url: string) => insecureTls && url.startsWith("https:");

  return {
    categories: [
      {
        id: "brainscan",
        name: "Brain Scan",
        description: "Analyze brain MRI images or video for atrophy detection and severity assessment",
        icon: "brain",
        inputLabel: "Image & Video Analysis",
        position: 0,
      },
      {
        id: "lungscan",
        name: "Lung Scan",
        description: "Upload scans for comprehensive lung analysis and disease detection",
        icon: "lungs",
        inputLabel: "Video Analysis",
        position: 1,
      },
    ],
    models: [
      {
        id: "detect-atrophy",
        name: "Detect Atrophy",
        version: "Version 1",
        type: "Mask RCNN",
        description: "Deep residual network optimized for brain MRI analysis",
        categoryId: "brainscan",
        url: brain("/predictmid/"),
        bodyMode: "raw",
        fileField: null,
        accepts: IMAGES,
        headers: {},
        insecureTls: tls(brain("/predictmid/")),
        timeoutMs: null,
        internal: false,
        enabled: true,
        position: 0,
        // brain.py get_any(): also served at /predictany. Never returns `value`.
        responses: [
          NOT_MRI,
          { when: "Shrinkage found", example: { message: "image received. Shrinkage detected with a probability of 90%" } },
          { when: "No shrinkage found", example: { message: "image received. No shrinkage with a probability of less than 30%" } },
          FAILED,
        ],
      },
      {
        id: "measure-atrophy-v1",
        name: "Detect & Measure Atrophy Size",
        version: "Version 1",
        type: "Mask RCNN",
        description: "Efficiently detect the size of an atrophy with state-of-the-art performance",
        categoryId: "brainscan",
        url: brain("/predictsz/"),
        bodyMode: "raw",
        fileField: null,
        accepts: IMAGES,
        headers: {},
        insecureTls: tls(brain("/predictsz/")),
        timeoutMs: null,
        internal: false,
        enabled: true,
        position: 1,
        // brain.py post_predict(): `value` is the integer size in mm².
        responses: sized(42, 98, 171),
      },
      {
        id: "measure-atrophy-yolo",
        name: "Detect & Measure Atrophy Size",
        version: "Version 2",
        type: "Yolo",
        description: "Efficiently detect the size of an atrophy with state-of-the-art performance and blazing speed",
        categoryId: "brainscan",
        url: braincize("/predictyolo"),
        bodyMode: "raw",
        fileField: null,
        accepts: IMAGES,
        headers: {},
        insecureTls: tls(braincize("/predictyolo")),
        timeoutMs: null,
        internal: false,
        enabled: true,
        position: 2,
        // braincize.py predict_yolo(): `value` is the size in mm², rounded to 2 decimals.
        responses: sized(48.25, 98.4, 163.07),
      },
      {
        id: "is-mri",
        name: "Is this a brain MRI?",
        version: null,
        type: "Yolo classifier",
        description: "Used by brain.py to reject images that are not brain MRIs before measuring. Not offered to users.",
        categoryId: null,
        url: braincize("/ismri"),
        bodyMode: "raw",
        fileField: null,
        accepts: IMAGES,
        headers: {},
        insecureTls: tls(braincize("/ismri")),
        timeoutMs: null,
        internal: true,
        enabled: true,
        position: 3,
        // braincize.py predict_is_mri(): the other shape, with `success`; `message` is the top class name.
        responses: [
          { when: "Classified. `message` is the top class name; \"random\" means not a brain MRI", example: { success: true, message: "random" } },
          { when: "Classification failed", example: { success: false, message: "failed!" } },
        ],
      },
    ],
  };
}
