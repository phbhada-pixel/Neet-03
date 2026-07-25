import { Question } from '../types/neet';

export const neetQuestionBank: Question[] = [
  // ==================== PHYSICS QUESTIONS ====================
  {
    id: "phy-101",
    subject: "Physics",
    section: "Section A",
    topic: "Kinematics & Motion in 1D",
    chapter: "Motion in a Straight Line",
    ncertClass: 11,
    question: "A ball is thrown vertically upwards with a velocity of 20 m/s from the top of a tower of height 25 m. Taking g = 10 m/s², the total time taken by the ball to hit the ground is:",
    options: ["3 s", "5 s", "7 s", "10 s"],
    correctAnswer: 1, // 5 s
    explanation: "Using displacement equation: s = ut + (1/2)at². Here s = -25 m, u = +20 m/s, a = -10 m/s².\n-25 = 20t - 5t² => 5t² - 20t - 25 = 0 => t² - 4t - 5 = 0 => (t - 5)(t + 1) = 0.\nSince t cannot be negative, t = 5 s.",
    ncertReference: "NCERT Class 11 Physics Ch 3: Motion in a Straight Line, Page 48"
  },
  {
    id: "phy-102",
    subject: "Physics",
    section: "Section A",
    topic: "Work, Energy & Power",
    chapter: "Work, Energy and Power",
    ncertClass: 11,
    question: "A particle of mass m moves in a circle of radius r with a centripetal acceleration given by a_c = k² r t², where k is a constant. The power delivered to the particle by the forces acting on it is:",
    options: ["m k² r² t", "m k r t", "m k² r t²", "2 m k² r² t"],
    correctAnswer: 0, // m k² r² t
    explanation: "a_c = v²/r = k² r t² => v = k r t.\nTangential acceleration a_t = dv/dt = k r.\nTangential force F_t = m a_t = m k r.\nPower P = F_t × v = (m k r) × (k r t) = m k² r² t.",
    ncertReference: "NCERT Class 11 Physics Ch 6: Work, Energy and Power, Page 128"
  },
  {
    id: "phy-103",
    subject: "Physics",
    section: "Section A",
    topic: "Current Electricity",
    chapter: "Current Electricity",
    ncertClass: 12,
    question: "In a wheatstone bridge, three resistances P, Q and R are connected in three arms and the fourth arm is formed by two resistances S₁ and S₂ connected in parallel. The condition for bridge balance is:",
    options: [
      "P/Q = R(S₁ + S₂) / (S₁ S₂)",
      "P/Q = R(S₁ S₂) / (S₁ + S₂)",
      "P/Q = (S₁ S₂) / [R(S₁ + S₂)]",
      "P/Q = R / (S₁ + S₂)"
    ],
    correctAnswer: 0,
    explanation: "Equivalent resistance in fourth arm S_eq = (S₁ S₂)/(S₁ + S₂).\nBridge balance condition: P/Q = R / S_eq = R / [(S₁ S₂)/(S₁ + S₂)] = R(S₁ + S₂)/(S₁ S₂).",
    ncertReference: "NCERT Class 12 Physics Ch 3: Current Electricity, Page 119"
  },
  {
    id: "phy-104",
    subject: "Physics",
    section: "Section A",
    topic: "Ray Optics",
    chapter: "Ray Optics and Optical Instruments",
    ncertClass: 12,
    question: "An equiconvex lens of focal length f is cut into two equal halves along its principal axis. The focal length of each half is:",
    options: ["f/2", "f", "2f", "4f"],
    correctAnswer: 1, // f
    explanation: "Cutting a lens along its principal axis (horizontally) does not change the radius of curvature of either surface or the refractive index. Therefore, the focal length of each half remains f. (Only intensity/brightness reduces).",
    ncertReference: "NCERT Class 12 Physics Ch 9: Ray Optics, Page 326"
  },
  {
    id: "phy-105",
    subject: "Physics",
    section: "Section B",
    topic: "Modern Physics - Atoms",
    chapter: "Atoms",
    ncertClass: 12,
    question: "The ratio of minimum to maximum wavelength in Balmar series of hydrogen atom spectrum is:",
    options: ["5 : 9", "9 : 5", "1 : 4", "4 : 1"],
    correctAnswer: 0, // 5 : 9
    explanation: "For Balmer series, n₁ = 2.\nMaximum wavelength corresponds to minimum energy transition (n₂ = 3):\n1/λ_max = R(1/2² - 1/3²) = R(1/4 - 1/9) = 5R/36 => λ_max = 36/(5R).\nMinimum wavelength corresponds to maximum energy transition (n₂ = ∞):\n1/λ_min = R(1/2² - 1/∞) = R/4 => λ_min = 4/R.\nRatio λ_min / λ_max = (4/R) / (36/5R) = (4 × 5) / 36 = 20 / 36 = 5 / 9.",
    ncertReference: "NCERT Class 12 Physics Ch 12: Atoms, Page 428"
  },
  {
    id: "phy-106",
    subject: "Physics",
    section: "Section B",
    topic: "Electrostatics",
    chapter: "Electric Charges and Fields",
    ncertClass: 12,
    question: "Two point charges +q and -q are held at distance 2a apart. The electric potential at a distance r (r >> a) on the equatorial line of the dipole is:",
    options: ["k p / r²", "k p / r³", "Zero", "-k p / r²"],
    correctAnswer: 2, // Zero
    explanation: "At any point on the equatorial plane of an electric dipole, the distances to +q and -q charges are equal (d = √(r² + a²)).\nElectric potential V = k(+q)/d + k(-q)/d = 0.",
    ncertReference: "NCERT Class 12 Physics Ch 2: Electrostatic Potential and Capacitance, Page 55"
  },

  // ==================== CHEMISTRY QUESTIONS ====================
  {
    id: "chem-201",
    subject: "Chemistry",
    section: "Section A",
    topic: "Chemical Bonding",
    chapter: "Chemical Bonding and Molecular Structure",
    ncertClass: 11,
    question: "Which of the following species has tetrahedral geometry, sp³ hybridization and diamagnetic nature?",
    options: ["[Ni(CN)₄]²⁻", "[NiCl₄]²⁻", "[Ni(CO)₄]", "[Cu(NH₃)₄]²⁺"],
    correctAnswer: 2, // [Ni(CO)₄]
    explanation: "[Ni(CO)₄] contains Ni in 0 oxidation state (3d⁸ 4s²). CO is a strong field ligand which causes pairing of electrons into 3d¹⁰. The empty 4s and three 4p orbitals hybridize to give sp³ tetrahedral geometry with no unpaired electrons (diamagnetic).",
    ncertReference: "NCERT Class 12 Chemistry Ch 9: Coordination Compounds, Page 251"
  },
  {
    id: "chem-202",
    subject: "Chemistry",
    section: "Section A",
    topic: "General Organic Chemistry (GOC)",
    chapter: "Organic Chemistry - Basic Principles & Techniques",
    ncertClass: 11,
    question: "Which amongst the following carbocations is the most stable?",
    options: [
      "(CH₃)₃C⁺ (tert-butyl cation)",
      "(C₆H₅)₃C⁺ (triphenylmethyl cation)",
      "CH₂=CH-CH₂⁺ (allyl cation)",
      "CH₃-CH₂⁺ (ethyl cation)"
    ],
    correctAnswer: 1, // (C₆H₅)₃C⁺
    explanation: "The triphenylmethyl carbocation (trityl cation, (C₆H₅)₃C⁺) is stabilized by extensive resonance delocalization across 3 phenyl rings (9 canonical resonance structures), making it exceptionally stable.",
    ncertReference: "NCERT Class 11 Chemistry Ch 12: Organic Chemistry, Page 352"
  },
  {
    id: "chem-203",
    subject: "Chemistry",
    section: "Section A",
    topic: "Electrochemistry",
    chapter: "Electrochemistry",
    ncertClass: 12,
    question: "The molar conductivity of 0.025 mol L⁻¹ methanoic acid is 46.1 S cm² mol⁻¹. Given λº(H⁺) = 349.6 S cm² mol⁻¹ and λº(HCOO⁻) = 54.6 S cm² mol⁻¹, the degree of dissociation (α) is:",
    options: ["0.114", "0.228", "0.057", "0.456"],
    correctAnswer: 0, // 0.114
    explanation: "Λº_m(HCOOH) = λº(H⁺) + λº(HCOO⁻) = 349.6 + 54.6 = 404.2 S cm² mol⁻¹.\nDegree of dissociation α = Λ_m / Λº_m = 46.1 / 404.2 ≈ 0.114 (or 11.4%).",
    ncertReference: "NCERT Class 12 Chemistry Ch 3: Electrochemistry, Page 83"
  },
  {
    id: "chem-204",
    subject: "Chemistry",
    section: "Section A",
    topic: "Biomolecules",
    chapter: "Biomolecules",
    ncertClass: 12,
    question: "Which of the following vitamins is water-soluble and its deficiency causes Pernicious Anaemia?",
    options: ["Vitamin B₁ (Thiamine)", "Vitamin B₁₂ (Cyanocobalamin)", "Vitamin C (Ascorbic Acid)", "Vitamin B₆ (Pyridoxine)"],
    correctAnswer: 1, // Vitamin B12
    explanation: "Vitamin B₁₂ (Cyanocobalamin) is a water-soluble vitamin containing Cobalt. Its deficiency causes Pernicious Anaemia (RBC deficiency/failure of RBC maturation).",
    ncertReference: "NCERT Class 12 Chemistry Ch 14: Biomolecules, Page 425"
  },
  {
    id: "chem-205",
    subject: "Chemistry",
    section: "Section B",
    topic: "Chemical Equilibrium & pH",
    chapter: "Equilibrium",
    ncertClass: 11,
    question: "The pH of a 0.01 M solution of weak acid HA having dissociation constant K_a = 1 × 10⁻⁵ is:",
    options: ["2.5", "3.5", "5.0", "7.0"],
    correctAnswer: 1, // 3.5
    explanation: "[H⁺] = √(K_a × C) = √(10⁻⁵ × 10⁻²) = √(10⁻⁷) = 10⁻³.⁵ M.\npH = -log[H⁺] = 3.5.",
    ncertReference: "NCERT Class 11 Chemistry Ch 7: Equilibrium, Page 221"
  },

  // ==================== BOTANY QUESTIONS ====================
  {
    id: "bot-301",
    subject: "Botany",
    section: "Section A",
    topic: "Cell Cycle & Cell Division",
    chapter: "Cell Cycle and Cell Division",
    ncertClass: 11,
    question: "The stage of meiosis during which synapsis, formation of synaptonemal complex, and bivalent formation occur is:",
    options: ["Leptotene", "Zygotene", "Pachytene", "Diplotene"],
    correctAnswer: 1, // Zygotene
    explanation: "During Zygotene stage of Prophase I, homologous chromosomes start pairing together (synapsis) accompanied by the formation of synaptonemal complex forming bivalents or tetrads.",
    ncertReference: "NCERT Class 11 Biology Ch 10: Cell Cycle and Cell Division, Page 168"
  },
  {
    id: "bot-302",
    subject: "Botany",
    section: "Section A",
    topic: "Plant Physiology - Photosynthesis",
    chapter: "Photosynthesis in Higher Plants",
    ncertClass: 11,
    question: "In C₄ plants, the primary CO₂ acceptor molecule and the enzyme responsible for initial CO₂ fixation in mesophyll cells are respectively:",
    options: [
      "RuBP and RuBisCO",
      "PEP (Phosphoenolpyruvate) and PEPcase",
      "OAA and Malate dehydrogenase",
      "PGA and RuBisCO"
    ],
    correctAnswer: 1, // PEP and PEPcase
    explanation: "In C₄ plants, the primary CO₂ acceptor is a 3-carbon molecule Phosphoenolpyruvate (PEP) present in mesophyll cells, catalyzed by PEP carboxylase (PEPcase). RuBisCO is present in bundle sheath cells.",
    ncertReference: "NCERT Class 11 Biology Ch 13: Photosynthesis in Higher Plants, Page 218"
  },
  {
    id: "bot-303",
    subject: "Botany",
    section: "Section A",
    topic: "Genetics & Inheritance",
    chapter: "Principles of Inheritance and Variation",
    ncertClass: 12,
    question: "If a homozygous tall pea plant with round seeds (TTRR) is crossed with a dwarf plant with wrinkled seeds (ttrr), what percentage of F₂ progeny will show recombinant phenotype?",
    options: ["25%", "37.5%", "50%", "62.5%"],
    correctAnswer: 1, // 37.5%
    explanation: "In a dihybrid cross, F₂ phenotypic ratio is 9 : 3 : 3 : 1 (Total 16 parts).\nParental phenotypes: Tall Round (9) & Dwarf Wrinkled (1).\nRecombinant phenotypes: Tall Wrinkled (3) & Dwarf Round (3) = 6 out of 16.\nPercentage = (6/16) × 100 = 37.5%.",
    ncertReference: "NCERT Class 12 Biology Ch 5: Principles of Inheritance and Variation, Page 80"
  },
  {
    id: "bot-304",
    subject: "Botany",
    section: "Section A",
    topic: "Biotechnology",
    chapter: "Biotechnology: Principles and Processes",
    ncertClass: 12,
    question: "The specific sequence of DNA recognized by restriction endonuclease EcoRI is:",
    options: [
      "5' - GAATTC - 3' / 3' - CTTAAG - 5'",
      "5' - GATATC - 3' / 3' - CTAGAG - 5'",
      "5' - AAGCTT - 3' / 3' - TTCGAA - 5'",
      "5' - GGATCC - 3' / 3' - CCTAGG - 5'"
    ],
    correctAnswer: 0, // 5'-GAATTC-3'
    explanation: "EcoRI recognizes the palindromic sequence 5'-GAATTC-3' / 3'-CTTAAG-5' and cuts between G and A when reading in 5' to 3' direction, leaving sticky ends.",
    ncertReference: "NCERT Class 12 Biology Ch 11: Biotechnology Principles, Page 196"
  },
  {
    id: "bot-305",
    subject: "Botany",
    section: "Section B",
    topic: "Ecology & Ecosystem",
    chapter: "Ecosystem",
    ncertClass: 12,
    question: "Which type of ecological pyramid is ALWAYS upright without any exception in nature?",
    options: [
      "Pyramid of Numbers in a Tree ecosystem",
      "Pyramid of Biomass in a Sea/Aquatic ecosystem",
      "Pyramid of Energy in all ecosystems",
      "Pyramid of Biomass in a Forest ecosystem"
    ],
    correctAnswer: 2, // Pyramid of Energy
    explanation: "The pyramid of energy is ALWAYS upright, because when energy flows from a particular trophic level to the next trophic level, some energy is always lost as heat at each step (10% law of energy transfer).",
    ncertReference: "NCERT Class 12 Biology Ch 14: Ecosystem, Page 248"
  },

  // ==================== ZOOLOGY QUESTIONS ====================
  {
    id: "zoo-401",
    subject: "Zoology",
    section: "Section A",
    topic: "Human Physiology - Circulation",
    chapter: "Body Fluids and Circulation",
    ncertClass: 11,
    question: "During a normal cardiac cycle in a healthy human, the volume of blood pumped out by each ventricle per beat (stroke volume) and the cardiac output are respectively:",
    options: ["50 mL and 3.5 L", "70 mL and 5.0 L", "120 mL and 7.2 L", "80 mL and 6.0 L"],
    correctAnswer: 1, // 70 mL & 5.0 L
    explanation: "Stroke volume = 70 mL blood per cardiac cycle.\nHeart rate = 72 beats/min.\nCardiac output = Stroke Volume × Heart Rate = 70 mL × 72 ≈ 5040 mL ≈ 5.0 Litres/min.",
    ncertReference: "NCERT Class 11 Biology Ch 18: Body Fluids and Circulation, Page 285"
  },
  {
    id: "zoo-402",
    subject: "Zoology",
    section: "Section A",
    topic: "Human Physiology - Excretion",
    chapter: "Excretory Products and Their Elimination",
    ncertClass: 11,
    question: "Juxtaglomerular apparatus (JGA) releases Renin in response to:",
    options: [
      "Increase in glomerular blood pressure",
      "Decrease in glomerular filtration rate (GFR) or renal blood pressure",
      "High Na⁺ ion concentration in macula densa",
      "Atrial Natriuretic Factor (ANF) release"
    ],
    correctAnswer: 1, // Decrease in GFR
    explanation: "A fall in glomerular blood flow / glomerular blood pressure / GFR activates the JG cells to release Renin, which converts angiotensinogen in blood to angiotensin I and subsequently angiotensin II to restore GFR.",
    ncertReference: "NCERT Class 11 Biology Ch 19: Excretory Products, Page 297"
  },
  {
    id: "zoo-403",
    subject: "Zoology",
    section: "Section A",
    topic: "Human Reproduction",
    chapter: "Human Reproduction",
    ncertClass: 12,
    question: "Which hormone surge triggers ovulation and rupture of the Graafian follicle around the 14th day of menstrual cycle?",
    options: ["Progesterone surge", "LH (Luteinizing Hormone) surge", "FSH surge", "Oxytocin surge"],
    correctAnswer: 1, // LH surge
    explanation: "Rapid secretion of LH leading to its maximum level during the mid-cycle (14th day) called LH surge induces rupture of Graafian follicle and thereby the release of ovum (ovulation).",
    ncertReference: "NCERT Class 12 Biology Ch 3: Human Reproduction, Page 51"
  },
  {
    id: "zoo-404",
    subject: "Zoology",
    section: "Section A",
    topic: "Evolution",
    chapter: "Evolution",
    ncertClass: 12,
    question: "Flippers of Penguins and Dolphins are examples of:",
    options: [
      "Homologous organs resulting from divergent evolution",
      "Analogous organs resulting from convergent evolution",
      "Vestigial organs resulting from natural selection",
      "Atavistic structures resulting from genetic drift"
    ],
    correctAnswer: 1, // Analogous organs / convergent evolution
    explanation: "Flippers of Penguins (birds) and Dolphins (mammals) perform similar function (swimming) but have different anatomical structures/origin. They are analogous organs representing convergent evolution.",
    ncertReference: "NCERT Class 12 Biology Ch 7: Evolution, Page 130"
  },
  {
    id: "zoo-405",
    subject: "Zoology",
    section: "Section B",
    topic: "Animal Kingdom",
    chapter: "Animal Kingdom",
    ncertClass: 11,
    question: "Which of the following animal phyla possesses bilateral symmetry, triploblastic organization, true coelom, and closed circulatory system with metamere segmentation?",
    options: ["Aschelminthes", "Arthropoda", "Annelida", "Mollusca"],
    correctAnswer: 2, // Annelida
    explanation: "Annelids (like Earthworms and Leeches) exhibit true metameric segmentation, bilateral symmetry, triploblastic coelomate body plan, and closed circulatory system.",
    ncertReference: "NCERT Class 11 Biology Ch 4: Animal Kingdom, Page 52"
  },
  {
    id: "zoo-406",
    subject: "Zoology",
    section: "Section B",
    topic: "Human Health & Disease",
    chapter: "Human Health and Disease",
    ncertClass: 12,
    question: "Malignant malaria is caused by which species of Plasmodium?",
    options: ["Plasmodium vivax", "Plasmodium malariae", "Plasmodium falciparum", "Plasmodium ovale"],
    correctAnswer: 2, // Plasmodium falciparum
    explanation: "Malignant malaria caused by Plasmodium falciparum is the most serious and potentially fatal malaria species.",
    ncertReference: "NCERT Class 12 Biology Ch 8: Human Health and Disease, Page 147"
  }
];
