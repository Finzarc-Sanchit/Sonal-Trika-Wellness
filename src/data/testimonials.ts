/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  designation: string;
  src: string;
}

export interface VideoTestimonial {
  id: string;
  name: string;
  designation: string;
  headline: string;
  posterSrc: string;
  videoSrc: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'priya-sharma',
    name: 'Priya Sharma',
    designation: 'Chakra Therapy Client',
    quote:
      "I'm blown away by the transformative power of sound healing at Trika. The chakra therapy sessions have brought incredible balance to my life!",
    src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'arjun-patel',
    name: 'Arjun Patel',
    designation: 'Clinical Sound Client',
    quote:
      "Sonia's sound healing sessions have significantly improved my well-being. The clinical organ therapy helped me manage my anxiety and stress levels remarkably!",
    src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'ananya-reddy',
    name: 'Ananya Reddy',
    designation: 'Organ Therapy Client',
    quote:
      "The organ therapy sessions at Trika have been life-changing. I've noticed significant improvements in my PCOS symptoms and overall hormonal balance.",
    src: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'rahul-kumar',
    name: 'Rahul Kumar',
    designation: 'Private Session Client',
    quote:
      "I love how Sonia blends science with spirituality. The trauma-sensitive approach makes me feel safe and supported throughout the healing journey.",
    src: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'meera-desai',
    name: 'Meera Desai',
    designation: 'Lunar Sound Bath Client',
    quote:
      'The New Moon sound baths at Trika are absolutely magical. Each session takes me on a deep journey of healing and transformation!',
    src: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'vikram-singh',
    name: 'Vikram Singh',
    designation: 'Corporate Wellness Lead',
    quote:
      'The corporate wellness sessions have transformed our workplace culture. Our team feels more balanced, focused, and connected.',
    src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e7?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'kavya-nair',
    name: 'Kavya Nair',
    designation: 'Group Sound Healing Client',
    quote:
      'The group sound healing sessions create such a powerful collective energy. I always leave feeling refreshed and deeply restored.',
    src: 'https://images.unsplash.com/photo-153452874177548-3d77b3fd0d2?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'aditya-joshi',
    name: 'Aditya Joshi',
    designation: 'Gong Immersion Client',
    quote:
      "Sonia's expertise in gong mastery is extraordinary. The sound frequencies create profound shifts in my energy and emotional state.",
    src: 'https://images.unsplash.com/photo-1519085366753-0a2f3f4b4a4?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'divya-iyer',
    name: 'Divya Iyer',
    designation: 'Sound Healing Practitioner',
    quote:
      "Sonia's teaching workshops are exceptional. The gong and bowl learning modules are well-structured and have deepened my practice significantly.",
    src: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'rohan-malhotra',
    name: 'Rohan Malhotra',
    designation: 'Sound Journey Client',
    quote:
      'I appreciate the attention to detail in every sound healing session. The curated sound journeys are beautifully designed and deeply therapeutic.',
    src: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'neha-gupta',
    name: 'Neha Gupta',
    designation: 'HR Director',
    quote:
      "The corporate wellness sessions have been a game-changer for our team. We've integrated them into our monthly wellness program with great success.",
    src: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5b2?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'siddharth-menon',
    name: 'Siddharth Menon',
    designation: 'Retreat Participant',
    quote:
      'The retreats and festival sound baths are incredible experiences. The collective healing energy is palpable and transformative.',
    src: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f10?auto=format&fit=crop&w=800&q=80',
  },
];

export const VIDEO_TESTIMONIALS: VideoTestimonial[] = [
  {
    id: 'client-story-1',
    name: 'Client Story 1',
    designation: 'Sound Wellness Client',
    headline: 'In a world of constant noise, clarity becomes everything',
    posterSrc:
      'https://res.cloudinary.com/dy8aaemyy/video/upload/so_0,q_auto,f_jpg/v1781334111/In_a_world_full_of_constant_noise_and_fast_paced_living_clarity_becomes_everything._That_s_w_hztjjg',
    videoSrc:
      'https://res.cloudinary.com/dy8aaemyy/video/upload/q_auto/f_auto/v1781334111/In_a_world_full_of_constant_noise_and_fast_paced_living_clarity_becomes_everything._That_s_w_hztjjg.mp4',
  },
  {
    id: 'piyush-sound-bath',
    name: 'Piyush',
    designation: 'Sound Bath Client',
    headline: "That's the beauty of a Sound Bath",
    posterSrc:
      'https://res.cloudinary.com/dy8aaemyy/video/upload/so_0,q_auto,f_jpg/v1781334098/Thank_you_Piyush_for_sharing_your_experience_so_honestly.That_s_the_beauty_of_a_Sound_Bath_some_bjk3zi',
    videoSrc:
      'https://res.cloudinary.com/dy8aaemyy/video/upload/q_auto/f_auto/v1781334098/Thank_you_Piyush_for_sharing_your_experience_so_honestly.That_s_the_beauty_of_a_Sound_Bath_some_bjk3zi.mp4',
  },
  {
    id: 'anju-sound-healing',
    name: 'Anju',
    designation: 'Group Sound Healing Client',
    headline: 'What happens when you finally allow yourself to pause',
    posterSrc:
      'https://res.cloudinary.com/dy8aaemyy/video/upload/so_0,q_auto,f_jpg/v1781340839/What_happens_when_you_finally_allow_yourself_to_pauseAfter_this_group_sound_healing_session_peo_online-video-cutter.com_ckecrw',
    videoSrc:
      'https://res.cloudinary.com/dy8aaemyy/video/upload/q_auto/f_auto/v1781340839/What_happens_when_you_finally_allow_yourself_to_pauseAfter_this_group_sound_healing_session_peo_online-video-cutter.com_ckecrw.mp4',
  },
];
