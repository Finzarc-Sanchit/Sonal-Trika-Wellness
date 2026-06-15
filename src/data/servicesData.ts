/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ServiceCard {
  id: string;
  verticalTitle: string;
  title: string;
  category: string;
  duration: string;
  description: string;
  learnMore: string;
  sessionDetails: string[];
  imageSrc: string;
  imageAlt: string;
  primaryCta: string;
  secondaryCta?: string;
  primaryHref?: string;
  secondaryHref?: string;
}

export interface ServiceGroup {
  id: string;
  label: string;
  headline: string;
  subtext?: string;
  items: ServiceCard[];
  compact?: boolean;
  accentColor: string;
}

export const SERVICE_GROUPS: ServiceGroup[] = [
  {
    id: 'individual',
    label: 'Individual Services',
    headline: 'One-to-one restoration',
    accentColor: '#A55A42',
    subtext:
      'When chronic stress has left your system fragmented, these private protocols meet you where you are — and guide you back to coherence.',
    items: [
      {
        id: 'chakra-therapy',
        verticalTitle: 'CHAKRA THERAPY',
        title: 'Chakra Therapy',
        category: 'Individual · Energy Alignment',
        duration: '60–90m',
        description:
          'When emotional blocks manifest as physical tension, targeted sound frequencies restore balance across your seven energy centres.',
        learnMore:
          "This practice uses specific sound frequencies, vibrations, and instruments (such as quartz crystal bowls or tuning forks) to resonate with the body's seven major energy centers, or chakras. The goal is to clear energetic blockages, align the chakras, and restore harmony between the physical and subtle bodies.",
        sessionDetails: [
          'Opens with a brief consultation to sense which of the seven energy centres feel blocked, depleted, or overactive.',
          'Quartz crystal bowls and tuning forks are placed at chakra points along the spine, crown, and body.',
          'Each frequency is sustained until the nervous system registers the shift — warmth, tingling, or emotional release are common.',
          'Root through crown sequencing ensures you leave grounded, not unmoored after deep energetic work.',
          'Ideal when you feel emotionally fragmented, creatively blocked, or energetically out of sync without a clear physical cause.',
          'Wear comfortable clothing; no prior sound healing experience required.',
        ],
        imageSrc: '/images/services/chakra-therapy.png',
        imageAlt: 'Chakra therapy with singing bowls and gong in studio',
        primaryCta: 'Book Session',
        secondaryCta: 'Learn More',
      },
      {
        id: 'ocean-therapy',
        verticalTitle: 'OCEAN THERAPY',
        title: 'Ocean Therapy',
        category: 'Individual · Acoustic Immersion',
        duration: '75m',
        description:
          'When the mind will not quiet, oceanic frequencies wash through the nervous system — lowering heart rate and restoring deep calm.',
        learnMore:
          'In sound wellness, this refers to the acoustic immersion in water sounds. It utilizes the natural, rhythmic frequencies of the ocean—or instruments that mimic them, like ocean drums and rainsticks—to act as a natural form of pink or brown noise. This continuous auditory wash helps lower the heart rate, soothe the nervous system, and induce deep, meditative relaxation.',
        sessionDetails: [
          'A private session built entirely around water-inspired soundscapes — ocean drums, rainsticks, and flowing bowl tones.',
          'Pink and brown noise frequencies mask mental chatter without requiring active meditation techniques.',
          'Heart rate and breath naturally decelerate as the continuous auditory wash deepens over 75 minutes.',
          'You remain fully supported and clothed; the experience is passive — your only task is to receive.',
          'Especially supportive for insomnia, anxiety loops, racing thoughts, and nervous systems stuck in sympathetic overdrive.',
          'Many clients report their deepest rest in weeks; allow quiet time after the session to integrate.',
        ],
        imageSrc: '/images/services/organ-therapy.png',
        imageAlt: 'Ocean therapy sound healing session with practitioner',
        primaryCta: 'Book Session',
        secondaryCta: 'Learn More',
      },
      {
        id: 'clinical-protocols',
        verticalTitle: 'CLINICAL PROTOCOLS',
        title: 'Clinical Protocols',
        category: 'Individual · Therapeutic',
        duration: '60–90m',
        description:
          'For those navigating anxiety, insomnia, or nervous system dysregulation — evidence-informed sound protocols designed for measurable restoration.',
        learnMore:
          'This involves the evidence-based, highly structured application of sound therapy. Rather than focusing purely on spiritual or energetic wellness, clinical protocols use measured, targeted frequencies (like binaural beats or specific Hz tones) for neurological and physiological outcomes, such as brainwave entrainment for insomnia, targeted stress reduction, or measurable pain management.',
        sessionDetails: [
          'Structured intake covering sleep patterns, pain levels, stress markers, and your therapeutic goals.',
          'Protocol selected for your presentation: binaural beats, specific Hz entrainment, or vagus nerve stimulation via sound.',
          'Each frequency phase is timed and sequenced — duration and intensity calibrated to intended neurological outcomes.',
          'Progress reviewed across sessions; protocols adjusted as your system responds and symptoms shift.',
          'Suited for insomnia, chronic pain, PTSD-related hypervigilance, and clients seeking medically informed wellness support.',
          'Complements — does not replace — medical care; share relevant health history during booking.',
        ],
        imageSrc: '/images/services/clinical-protocols.png',
        imageAlt: 'Clinical sound healing instruments including tuning forks, singing bowls, and crystals',
        primaryCta: 'Book Session',
        secondaryCta: 'Learn More',
      },
    ],
  },
  {
    id: 'group',
    label: 'Group',
    headline: 'Collective healing experiences',
    accentColor: '#8C82B6',
    subtext:
      'Shared resonance amplifies transformation. These group formats create space for teams, communities, and circles to restore together.',
    items: [
      {
        id: 'corporate-wellness',
        verticalTitle: 'CORPORATE WELLNESS',
        title: 'Corporate Wellness',
        category: 'Group · Executive Programs',
        duration: '60–90m',
        description:
          'High-performing teams carry invisible load. Immersive sound sessions rebuild focus, resilience, and collective nervous system regulation.',
        learnMore:
          '70% of professionals report burnout symptoms — leadership performance begins with nervous system recovery. Corporate sound wellness brings structured vibrational therapy into the workplace — not as a perk, but as nervous system recovery for teams under sustained pressure. Our Executive Recovery Programs include Executive Nervous System Reset, Burnout Prevention Workshops, Women Leadership Wellness, and Team Alignment Programs — designed to shift groups out of sympathetic overdrive and into shared calm.',
        sessionDetails: [
          'Executive Nervous System Reset — leadership-focused recovery for founders, CXOs, and high-output teams.',
          'Burnout Prevention Workshops — structured group sessions that address sustained sympathetic activation before it becomes chronic.',
          'Women Leadership Wellness — cohort programmes for women navigating executive pressure and invisible load.',
          'Team Alignment Programs — immersive sound sessions that rebuild focus, empathy, and collective coherence.',
          'Delivered on-site at your office or at the Trika studio — seated or lying down, fully clothed.',
          'Opening breathwork settles the room before sound builds gradually; no one is singled out or asked to perform.',
          'Measurable outcomes include reduced meeting fatigue, improved focus, and stronger team coherence after sessions.',
          'Request a corporate proposal to design a programme for your organisation.',
        ],
        imageSrc: '/images/services/corporate-wellness.png',
        imageAlt: 'Corporate team in guided sound wellness meditation session',
        primaryCta: 'Request Corporate Proposal',
        secondaryCta: 'Learn More',
        secondaryHref: '/services#group',
      },
      {
        id: 'retreats-festivals',
        verticalTitle: 'RETREATS & FESTIVALS',
        title: 'Retreats & Festivals',
        category: 'Group · Immersive Events',
        duration: '60–90m',
        description:
          'Multi-day immersions and festival stages where sacred sound meets nature — designed for deep release and community connection.',
        learnMore:
          'Retreat and festival sessions extend sound wellness beyond a single hour — creating shared acoustic fields where groups release together. Whether held in nature, at a wellness retreat, or on a festival stage, these immersions use full gong and bowl arrays to hold space for collective nervous system down-regulation and emotional catharsis in community.',
        sessionDetails: [
          '60–90 minute immersions within multi-day retreat programmes or as standalone festival sound stages.',
          'Full instrument array: multiple gongs, singing bowls, and percussion for layered harmonic fields.',
          'Participants rest on mats or sit in circle — accessible for beginners and experienced practitioners alike.',
          'Often paired with nature settings, fire circles, or post-yoga savasana for maximum receptivity.',
          'Collective energy amplifies individual release — many describe feeling held by the group field.',
          'Festival and retreat bookings coordinated directly with hosts; private slots available on enquiry.',
        ],
        imageSrc: '/images/services/retreats-festivals.png',
        imageAlt: 'Retreat sound bath with candles and singing bowls',
        primaryCta: 'View Retreats',
        secondaryCta: 'Book Experience',
        primaryHref: '/#retreats',
      },
      {
        id: 'moon-sound-baths',
        verticalTitle: 'MOON SOUND BATHS',
        title: 'New Moon / Full Moon Sound Baths',
        category: 'Group · Lunar Ceremonies',
        duration: '90m',
        description:
          'Lunar cycles mark natural thresholds for release and renewal. These ceremonial sound baths align your rhythm with the cosmos.',
        learnMore:
          'New Moon and Full Moon sound baths are ceremonial group sessions timed to lunar phases — natural thresholds for intention-setting, release, and renewal. Full Moons support letting go of what no longer serves; New Moons support planting intentions in quiet ground. The gong and bowls hold space while the group rests together under the current lunar arc.',
        sessionDetails: [
          '90-minute ceremonial immersion — arrive 10 minutes early for settling and optional intention-setting.',
          'Full Moon sessions emphasise release, catharsis, and completion; New Moon sessions on clarity and inward rest.',
          'Group size kept intimate so each person remains held within the collective acoustic field.',
          'Includes brief lunar context, guided breath, extended gong sequence, and gentle return with grounding tea.',
          'Monthly calendar published in advance; Full Moon circles often sell out — early reservation recommended.',
          'Bring a journal if you wish to capture insights; wear layers for temperature comfort during rest.',
        ],
        imageSrc: '/images/services/moon-sound-baths.png',
        imageAlt: 'Outdoor new moon full moon sound bath with singing bowls',
        primaryCta: 'Reserve Spot',
        secondaryCta: 'View Calendar',
      },
    ],
    compact: true,
  },
  {
    id: 'teaching',
    label: 'Teaching',
    headline: 'Learn the craft of sacred sound',
    accentColor: '#7A8B6F',
    subtext:
      'For those called to hold space for others — structured learning paths from foundational practice to advanced instrument mastery.',
    items: [
      {
        id: 'beginners-workshop',
        verticalTitle: 'BEGINNERS WORKSHOP',
        title: "Beginners' Sound Healing Workshop",
        category: 'Teaching · Foundation',
        duration: '3–4 hrs',
        description:
          'No prior experience required. Learn the principles of vibrational therapy, bowl techniques, and holding space for healing.',
        learnMore:
          'This foundational workshop introduces the science and art of sound healing for those new to the practice. You will learn how vibration affects the nervous system, how to play singing bowls safely and intentionally, and the ethics of holding space for others — without needing any prior musical or wellness training.',
        sessionDetails: [
          'Half-day format (3–4 hours) with breaks — theory, live demonstration, and guided hands-on practice.',
          'Covers nervous system basics, bowl selection, striking and singing techniques, and how to structure a session.',
          'Small group size ensures individual feedback; all bowls and mallets provided on the day.',
          'Ethics of holding space, contraindications, and client safety covered alongside technique.',
          'Receive a practitioner handbook with session templates to take home and practice independently.',
          'Certificate of attendance; natural pathway into advanced Gong and Bowl Learning Modules.',
        ],
        imageSrc: '/images/services/beginners-workshop.png',
        imageAlt: 'Beginners sound healing workshop with singing bowls and instruments',
        primaryCta: 'Register',
        secondaryCta: 'View Curriculum',
      },
      {
        id: 'gong-bowl-modules',
        verticalTitle: 'GONG & BOWL MODULES',
        title: 'Gong and Bowl Learning Modules',
        category: 'Teaching · Advanced',
        duration: '4–6 hrs',
        description:
          'Deep-dive modules in gong mastery and singing bowl artistry — for practitioners ready to refine technique and expand their repertoire.',
        learnMore:
          'Advanced modules for practitioners ready to deepen their instrument relationship and session craft. Each module focuses on either gong mastery or singing bowl artistry — technique, sequencing, reading group energy, and building the sustained acoustic fields required for immersions and private client work.',
        sessionDetails: [
          'Modular format: 4–6 hours per module, bookable individually or as a progressive series.',
          'Gong module: mallet technique, wave building, volume dynamics, and safe session arcs for groups.',
          'Bowl module: harmonic layering, chakra sequencing, and intuitive bowl selection for client work.',
          'Prerequisite: Beginners\' workshop or equivalent; complimentary assessment call if you are unsure of readiness.',
          'Includes supervised practice time, peer feedback, and guidance on building a professional offering.',
          'Ideal for yoga teachers, wellness practitioners, and aspiring sound healers ready to hold space professionally.',
        ],
        imageSrc: '/images/services/gong-bowl-modules.png',
        imageAlt: 'Gong and bowl learning modules with ritual instruments',
        primaryCta: 'Enrol Now',
        secondaryCta: 'Module Details',
      },
    ],
    compact: true,
  },
];
