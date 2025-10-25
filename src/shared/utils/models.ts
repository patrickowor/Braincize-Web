export interface Model {
  id: string;
  name: string;
  version: string;
  type: string;
  description: string;
  endpoint: string;
  document_type: 'images' | 'video'
  document_max: number;
}

export const availableModels: Model[] = [
  {
    id: "resnet-50",
    name: "Detect Atrophy",
    version: "Version 1",
    type: "Mask RCNN",
    description: "Deep residual network optimized for brain MRI analysis",
    document_max: 20,
    document_type: "images",
    endpoint: "predictmid/",
  },
  {
    id: "mrcnn-1 ",
    name: "Detect & Measure Atrophy Size",
    version: "Version 1",
    type: "Mask RCNN",
    description:
      "Efficiently detect the size of an atrophy with state-of-the-art performance",
    document_max: 20,
    document_type: "images",
    endpoint: "predictsz/",
  },
  {
    id: "yolo-1",
    name: "Detect & Measure Atrophy Size",
    version: "Version 2",
    type: "Yolo",
    description:
      "Efficiently detect the size of an atrophy with state-of-the-art performance and blazing speed",
    document_max: 20,
    document_type: "images",
    endpoint: "predictyolo",
  },
];
