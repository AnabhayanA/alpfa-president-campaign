import preparedPhotos from "./photoAssets.json";
import { assetUrl, assetSrcSet } from "./assetUrl";
export const chapterLogo = assetUrl("/assets/logos/alpfa-njit.png");
export const finaleCat = {
  src: assetUrl("/assets/gifs/cat-catmeme.gif"),
  poster: assetUrl("/assets/gifs/cat-still.webp"),
  caption: "The campaign ends. The cat’s just getting started.",
  alt: "A black cat dancing and gesturing toward the viewer",
  kind: "gif",
  fit: "contain",
  width: 357,
  height: 498,
};

// Responsive, metadata-free copies of the user's supplied photographs.
function supplied(name, caption, alt, kind = "events", options = {}) {
  const { src, srcSet, width, height } = preparedPhotos[name];
  return {
    src: assetUrl(src),
    srcSet: assetSrcSet(srcSet),
    width,
    height,
    caption,
    alt,
    kind,
    fit: "contain",
    ...options,
  };
}
const photos = {
  portrait: supplied(
    "IMG_5808.HEIC",
    "ALPFA portrait · August 2026",
    "Campaign portrait in front of an ALPFA backdrop",
    "portrait",
    { fit: "cover", position: "50% 28%" },
  ),
  soccer: supplied(
    "C71EFDE5-6AD0-463F-8972-9C6FE522B989.jpg",
    "Our soccer team · photo date not supplied",
    "Soccer players standing together on the NJIT indoor field",
    "soccer",
  ),
  soccerAlternate: supplied(
    "E7B70951-5CCB-4FA0-ABB8-98A586A18E64.jpg",
    "Another frame with the team · photo date not supplied",
    "The soccer team posing in red NJIT jerseys on the indoor field",
    "soccer",
  ),
  regional: supplied(
    "IMG_0323.JPG",
    "Connections beyond the classroom. · September 2025",
    "Group photo in front of an ALPFA New Jersey banner",
    "networking",
  ),
  fallMixer: supplied(
    "IMG_0595.heic",
    "Meeting more people · October 2025",
    "Group photo at a gathering in front of a Montclair backdrop",
    "networking",
  ),
  parade: supplied(
    "IMG_3392.PNG",
    "Community beyond campus · October 2025",
    "Friends standing together at a street parade",
    "events",
  ),
  campus: supplied(
    "IMG_4556.PNG",
    "Campus friends · March 2026",
    "A playful campus photo with friends and a Wear It Wednesday caption",
    "events",
  ),
  repost: supplied(
    "IMG_4561.PNG",
    "NJIT story repost · supplied screenshot",
    "Screenshot of an NJIT story showing soccer and ALPFA community photos",
    "events",
  ),
  springMixer: supplied(
    "IMG_4787.HEIC",
    "ALPFA NJ connections · March 2026",
    "Three attendees taking a selfie near an ALPFA NJ banner",
    "networking",
  ),
  april: supplied(
    "IMG_5005.HEIC",
    "From the photo album · April 2026",
    "A solo photo in front of a Rutgers and Fiserv backdrop",
    "events",
  ),
  aprilGroup: supplied(
    "IMG_5014.HEIC",
    "Connecting with others · April 2026",
    "Four people posing together in front of a Rutgers and Fiserv backdrop",
    "networking",
  ),
  summer: supplied(
    "IMG_5451.HEIC",
    "Summer memories · July 2026",
    "Two people outdoors holding an Ecuador flag",
    "events",
  ),
  convention: supplied(
    "531FA750-0115-4524-A348-045A34D9C09E.jpg",
    "A connection from the convention floor · date not supplied",
    "Two attendees posing together at a convention exhibition booth",
    "networking",
  ),
  appIdea: supplied(
    "ooo-shi-1790019333321.jpg",
    "An app idea, a phone, and some personality.",
    "Anabhayan holding up a phone with a playful expression",
    "app",
  ),
  committee: supplied(
    "IMG_6545.HEIC",
    "With the committee · date not supplied",
    "Committee group photo together at a restaurant",
    "committee",
  ),
  pieEboard: supplied(
    "IMG_0959.heic",
    "Pie the E-board · October 2026",
    "Anabhayan with pie on his face, holding a Pie the E-board poster outdoors",
    "events",
  ),
};
export const photoAlbum = Object.values(photos).map((photo) => ({
  ...photo,
  fit: "contain",
}));

// Add additional chapter photos here; captions keep plans distinct from completed work.
// Each chapter supports any number of photos with individual captions and alt text.
export const portrait = {
  ...photos.portrait,
  eager: true,
  alt: "Anabhayan Ahruran, candidate for ALPFA NJIT President",
};
export const chapters = [
  {
    id: "fall-2025",
    season: "Fall",
    year: "2025",
    label: "Where it started",
    title: "Before the title,\nthere was action.",
    tag: "Community starts with showing up.",
    body: "Before I became an official member, I started an ALPFA intramural soccer team. My ALPFA story began by bringing people together—and making sure everyone had a place.",
    points: [
      "Started and captained the ALPFA intramural soccer team.",
      "Captained the team, coordinated personally with players, and made sure everyone had opportunities to play during our 30-minute games.",
      "Attended chapter mixers and off-campus networking events.",
      "Joined the IT Committee and helped build the ALPFA NJIT website.",
    ],
    photos: [
      {
        ...photos.soccer,
      },
      {
        ...photos.regional,
      },
      photos.soccerAlternate,
      photos.fallMixer,
      photos.parade,
    ],
  },
  {
    id: "winter-2026",
    season: "Winter",
    year: "2026",
    label: "The commitment",
    title: "I didn’t win.\nI didn’t disappear.",
    tag: "A result doesn’t define a commitment.",
    body: "Former President Alex encouraged me to run for Vice President. I ran. I didn’t win. And I kept showing up.",
    points: [
      "Ran for Vice President with encouragement from former President Alex.",
      "Continued attending ALPFA events and contributing during Spring 2026.",
      "Kept contributing to the community, with or without a title.",
    ],
    photos: [
      {
        ...photos.springMixer,
      },
      {
        ...photos.campus,
      },
      photos.repost,
    ],
    galleryNote: "Still showing up · Community moments from Spring 2026.",
    moment: {
      ...supplied("IMG_2733.PNG", "", "", "meme"),
      caption: "The election ended. My calendar of ALPFA events did not.",
      alt: "A thoughtful monkey looking upward with a finger near its mouth",
      kind: "meme",
    },
  },
  {
    id: "spring-2026",
    season: "Spring",
    year: "2026",
    label: "The next step",
    title: "Stepping into\nleadership.",
    tag: "Good ideas deserve a first step.",
    body: "As IT Director, I began turning participation into responsibility—building relationships, sharing ideas, and helping bring people into the room.",
    points: [
      "Became IT Director and contributed to planning a hackathon, even outside my comfort zone.",
      "Built relationships, encouraged participation, and co-hosted my first event.",
    ],
    photos: [
      {
        ...photos.april,
      },
      {
        ...photos.aprilGroup,
      },
      photos.springMixer,
    ],
    galleryNote: "Community snapshots · Spring 2026.",
  },
  {
    id: "spring-2026-ideas",
    season: "Spring",
    year: "2026",
    label: "Thinking bigger",
    title: "What if we\nbuilt more?",
    tag: "An idea is an invitation to start.",
    body: "I ran for IT Director reelection for the upcoming Fall 2026 semester with ideas that reached beyond a single event—or a single campus.",
    points: [
      "Proposed developing an ALPFA NJIT mobile app.",
      "Wanted to strengthen connections with former ALPFA members.",
      "Proposed building relationships with students at other campuses.",
    ],
    photos: [
      {
        ...photos.appIdea,
      },
      {
        ...photos.aprilGroup,
      },
    ],
    moment: {
      ...supplied("IMG_2141.PNG", "", "", "meme"),
      caption: "Me saying “one more idea” at the end of a meeting.",
      alt: "A Sonic reaction image with hands held together in a plotting pose",
      kind: "meme",
    },
  },
  {
    id: "fall-2026",
    season: "Fall",
    year: "2026",
    label: "The team",
    title: "From one idea\nto a team.",
    tag: "Six people. One shared direction.",
    body: "Leadership means making room for others to lead, too. This semester, that meant building a committee and creating a rhythm for working together.",
    points: [
      "Interviewed and recruited five IT Committee members, forming a six-person team including myself.",
      "Established weekly committee meetings.",
      "Continued developing the ALPFA NJIT mobile app and collaborated on plans for an app demo event.",
      "The demo event has not happened yet because of limited funding.",
    ],
    photos: [
      {
        ...photos.committee,
      },
      {
        ...photos.appIdea,
        caption: "App idea photo · demo still pending funding.",
      },
      photos.pieEboard,
    ],
  },
];
export const visions = [
  {
    icon: "community",
    title: "Stronger community",
    short: "More than a membership.",
    text: "Grow membership engagement and make members feel included. Create more opportunities to connect, participate, and find their place in the chapter.",
  },
  {
    icon: "marketing",
    title: "Better event marketing",
    short: "Great events deserve a full room.",
    text: "Promote chapter events more consistently and reach more students. Give our work a clearer voice and help more people discover what ALPFA has to offer.",
  },
  {
    icon: "campus",
    title: "Beyond NJIT",
    short: "Expand our circle.",
    text: "Build stronger relationships with ALPFA chapters at other universities and participate in regional ALPFA events. Connect across schools, share ideas, and develop useful partnerships.",
  },
  {
    icon: "network",
    title: "More events & opportunities",
    short: "More reasons to get involved.",
    text: "Create more engaging experiences and professional opportunities for members. Listen to what students want to learn, who they want to meet, and how they want to participate.",
  },
  {
    icon: "team",
    title: "Executive board collaboration",
    short: "Better, together.",
    text: "Work closely with the talented current executive board. Listen, align priorities, and build on the strengths that each person brings.",
  },
  {
    icon: "calendar",
    title: "Winter planning",
    short: "A head start on what’s next.",
    text: "Use winter break for flexible, advance planning of events, budgets, outreach, sponsorship discussions, marketing, and coordination. Recognize that board members have different availability and plan around it.",
  },
  {
    icon: "spark",
    title: "Turning ideas into reality",
    short: "Help the next idea take its first step.",
    text: "Explore funding and sponsorship opportunities to support initiatives such as the app demo event. Be transparent about what is planned and what still needs support.",
  },
];
export const finaleMedia = [
  {
    ...supplied("D1A30706-2F2F-468E-AA04-307A0769CF11.jpg", "", "", "meme"),
    caption: "When someone asks if I’m still showing up",
    alt: "A surprised monkey with its hands on its head",
    kind: "meme",
  },
  {
    ...photos.campus,
    caption: "The NO button trying to leave this campaign",
    alt: "A playful Wear It Wednesday photo of friends on campus",
    kind: "meme",
  },
];
