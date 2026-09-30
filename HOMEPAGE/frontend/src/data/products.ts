export type Product = {
  slug: string;
  name: string;
  subtitle: string;
  category: string;
  accent: string;
  accepts: string; // what kind of image to upload
  description: string;
  detects: string[];
};

export const products: Product[] = [
  {
    slug: 'mixr',
    name: 'MiXR',
    subtitle: 'Chest X-Ray AI',
    category: 'Chest imaging',
    accent: '#00DCCE',
    accepts: 'Chest X-ray',
    description: 'Upload a chest X-ray and get a ranked list of findings, highlighted areas and a draft report.',
    detects: ['Pneumonia', 'Tuberculosis signs', 'Pleural effusion', 'Pneumothorax', 'Cardiomegaly', 'Lung nodule'],
  },
  {
    slug: 'mier',
    name: 'MiER',
    subtitle: 'Emergency Radiology AI',
    category: 'Emergency care',
    accent: '#FF7869',
    accepts: 'Emergency X-ray or CT',
    description: 'Screens emergency scans for urgent findings so critical cases are seen first.',
    detects: ['Collapsed lung', 'Large fluid build-up', 'Enlarged heart', 'Consolidation', 'Urgent priority flag'],
  },
  {
    slug: 'milung',
    name: 'MiLung',
    subtitle: 'Lung Cancer AI',
    category: 'Oncology',
    accent: '#98AED9',
    accepts: 'Chest CT slice',
    description: 'Finds and measures lung nodules on CT images to help with early detection.',
    detects: ['Lung nodules', 'Nodule size', 'Nodule location', 'Follow-up flag'],
  },
  {
    slug: 'mistroke',
    name: 'MiStroke',
    subtitle: 'Stroke Care AI',
    category: 'Neuro imaging',
    accent: '#FFB86B',
    accepts: 'Head CT or brain MRI',
    description: 'Reviews brain scans for signs of bleeding or blocked blood flow.',
    detects: ['Brain bleed', 'Blocked vessel signs', 'Affected region', 'Stroke team alert'],
  },
  {
    slug: 'mitrack',
    name: 'MiTrack',
    subtitle: 'TB Monitoring',
    category: 'Public health',
    accent: '#7BD88F',
    accepts: 'Chest X-ray',
    description: 'Screens chest X-rays for tuberculosis and supports follow-up over time.',
    detects: ['TB-suggestive pattern', 'Cavities', 'Lung scarring', 'Screening risk score'],
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);