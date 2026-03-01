import AsyncStorage from "@react-native-async-storage/async-storage";
import { SakePost, Shelf, UserProfile } from "../types";

const KEYS = {
  POSTS: "sake_posts",
  SHELVES: "sake_shelves",
  PROFILE: "sake_profile",
  TIMELINE: "sake_timeline",
};

// --- Shelves ---
export async function getShelves(): Promise<Shelf[]> {
  const data = await AsyncStorage.getItem(KEYS.SHELVES);
  return data ? JSON.parse(data) : [];
}

export async function saveShelves(shelves: Shelf[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.SHELVES, JSON.stringify(shelves));
}

// --- Posts ---
export async function getPosts(): Promise<SakePost[]> {
  const data = await AsyncStorage.getItem(KEYS.POSTS);
  return data ? JSON.parse(data) : [];
}

export async function savePosts(posts: SakePost[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.POSTS, JSON.stringify(posts));
}

export async function getPostsByShelf(shelfId: string): Promise<SakePost[]> {
  const posts = await getPosts();
  return posts.filter((p) => p.shelfId === shelfId);
}

// --- Profile ---
export async function getProfile(): Promise<UserProfile | null> {
  const data = await AsyncStorage.getItem(KEYS.PROFILE);
  return data ? JSON.parse(data) : null;
}

export async function saveProfile(profile: UserProfile): Promise<void> {
  await AsyncStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
}

// --- Timeline (demo data for SNS feel) ---
export async function getTimeline(): Promise<SakePost[]> {
  const data = await AsyncStorage.getItem(KEYS.TIMELINE);
  return data ? JSON.parse(data) : [];
}

export async function saveTimeline(posts: SakePost[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.TIMELINE, JSON.stringify(posts));
}
