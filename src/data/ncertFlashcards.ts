import { Flashcard } from '../types/neet';

export const ncertFlashcards: Flashcard[] = [
  // Physics
  {
    id: "fc-p1",
    subject: "Physics",
    topic: "Ray Optics",
    chapter: "Ray Optics and Optical Instruments",
    front: "What is Lens Maker's Formula for a thin lens in air?",
    back: "1/f = (μ - 1) [ (1/R₁) - (1/R₂) ]\n\nWhere μ is the refractive index of lens material, R₁ and R₂ are radii of curvature.",
    ncertReference: "Class 12 Physics - Page 326",
    isHighYield: true
  },
  {
    id: "fc-p2",
    subject: "Physics",
    topic: "Current Electricity",
    chapter: "Current Electricity",
    front: "What is the relation between Drift Velocity (v_d) and Electric Field (E)?",
    back: "v_d = (e E / m) τ\n\nWhere e = electron charge, m = electron mass, τ = relaxation time.\nalso Current I = n A e v_d.",
    ncertReference: "Class 12 Physics - Page 98",
    isHighYield: true
  },
  {
    id: "fc-p3",
    subject: "Physics",
    topic: "Work Energy Power",
    chapter: "Work, Energy and Power",
    front: "What is the relation between Linear Momentum (P) and Kinetic Energy (K)?",
    back: "K = P² / (2m)   or   P = √(2mK)\n\nIf momentum is increased by 50%, KE increases by 125%.",
    ncertReference: "Class 11 Physics - Page 118",
    isHighYield: true
  },

  // Chemistry
  {
    id: "fc-c1",
    subject: "Chemistry",
    topic: "Organic Chemistry",
    chapter: "Aldehydes, Ketones and Carboxylic Acids",
    front: "What is Aldol Condensation requirement and product?",
    back: "Requirement: Aldehydes or Ketones containing at least one α-hydrogen in presence of dilute NaOH.\n\nProduct: β-hydroxyaldehyde (Aldol) or β-hydroxyketone (Ketol), which on heating loses H₂O to form α,β-unsaturated carbonyl compound.",
    ncertReference: "Class 12 Chemistry - Page 372",
    isHighYield: true
  },
  {
    id: "fc-c2",
    subject: "Chemistry",
    topic: "Chemical Bonding",
    chapter: "Chemical Bonding and Molecular Structure",
    front: "How to calculate Bond Order using Molecular Orbital Theory (MOT)?",
    back: "Bond Order = ½ (N_b - N_a)\n\nN_b = Number of bonding electrons\nN_a = Number of antibonding electrons\n\nHigher Bond Order = Greater Stability = Shorter Bond Length.",
    ncertReference: "Class 11 Chemistry - Page 104",
    isHighYield: true
  },
  {
    id: "fc-c3",
    subject: "Chemistry",
    topic: "Inorganic Chemistry",
    chapter: "Coordination Compounds",
    front: "What is Spectrochemical Series for Ligands order of field strength?",
    back: "I⁻ < Br⁻ < SCN⁻ < Cl⁻ < S²⁻ < F⁻ < OH⁻ < C₂O₄²⁻ < H₂O < NCS⁻ < EDTA⁴⁻ < NH₃ < en < CN⁻ < CO\n\nCO is the strongest field ligand causing maximum crystal field splitting (Δ_o).",
    ncertReference: "Class 12 Chemistry - Page 253",
    isHighYield: true
  },

  // Botany
  {
    id: "fc-b1",
    subject: "Botany",
    topic: "Photosynthesis",
    chapter: "Photosynthesis in Higher Plants",
    front: "What is Kranz Anatomy and where is it found?",
    back: "Kranz Anatomy ('Crown' arrangement of bundle sheath cells with large chloroplasts lacking grana) is found in C₄ Plants (e.g. Maize, Sugarcane, Sorghum).\n\nProtects RuBisCO from photorespiration!",
    ncertReference: "Class 11 Biology - Page 217",
    isHighYield: true
  },
  {
    id: "fc-b2",
    subject: "Botany",
    topic: "Cell Cycle",
    chapter: "Cell Cycle and Cell Division",
    front: "What happens in Pachytene stage of Meiosis I?",
    back: "Pachytene stage:\n1. Crossing Over between non-sister chromatids of homologous chromosomes.\n2. Enzyme involved: Recombinase.\n3. Recombination nodules become visible.",
    ncertReference: "Class 11 Biology - Page 168",
    isHighYield: true
  },

  // Zoology
  {
    id: "fc-z1",
    subject: "Zoology",
    topic: "Human Physiology",
    chapter: "Body Fluids and Circulation",
    front: "What are the components of ECG waves (P, QRS, T)?",
    back: "P wave: Depolarisation of Atria (Atrial contraction)\nQRS complex: Depolarisation of Ventricles (Ventricle contraction)\nT wave: Repolarisation of Ventricles (Return to resting state)\n\nCounting QRS complexes in a given time gives Heart Rate!",
    ncertReference: "Class 11 Biology - Page 286",
    isHighYield: true
  },
  {
    id: "fc-z2",
    subject: "Zoology",
    topic: "Genetics",
    chapter: "Principles of Inheritance",
    front: "What is Haemophilia and its mode of inheritance?",
    back: "Haemophilia is a Sex-linked Recessive disease (X-linked).\n\nUncontrolled bleeding due to deficiency of clotting factors VIII (Haemophilia A) or IX (Haemophilia B). Heterozygous females are carriers, males are affected.",
    ncertReference: "Class 12 Biology - Page 89",
    isHighYield: true
  }
];
