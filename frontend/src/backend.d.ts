import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type CommentId = bigint;
export type Time = bigint;
export interface Comment {
    id: CommentId;
    content: string;
    author: UserId;
    timestamp: Time;
    postId: PostId;
}
export type PostId = bigint;
export type UserId = Principal;
export interface Post {
    id: PostId;
    likeCount: bigint;
    content: string;
    author: UserId;
    timestamp: Time;
}
export interface UserProfile {
    bio: string;
    username: string;
    avatar?: ExternalBlob;
}
export interface FreeStuffPost {
    id: bigint;
    title: string;
    verified: boolean;
    content: string;
    contentType: string;
    views: bigint;
    link?: string;
    tags: Array<string>;
    isAvailable: boolean;
    description: string;
    author: Principal;
    likes: bigint;
    expirationTime?: Time;
    timestamp: Time;
    category: FreeStuffCategory;
    proof?: string;
}
export enum FreeStuffCategory {
    tipsAndTricks = "tipsAndTricks",
    freeGamePass = "freeGamePass",
    promoCode = "promoCode",
    freeUGC = "freeUGC",
    general = "general"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addComment(postId: PostId, content: string): Promise<CommentId>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createFreeStuffPost(title: string, description: string, category: FreeStuffCategory, contentType: string, content: string, tags: Array<string>, expirationTime: Time | null, link: string | null, proof: string | null): Promise<bigint>;
    createOrUpdateProfile(username: string, bio: string): Promise<void>;
    createPost(content: string): Promise<PostId>;
    deleteFreeStuffPost(postId: bigint): Promise<void>;
    deletePost(postId: PostId): Promise<void>;
    getAllPosts(): Promise<Array<Post>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getComments(postId: PostId): Promise<Array<Comment>>;
    getFreeStuffPosts(category: FreeStuffCategory | null, tag: string | null, sortBy: string | null): Promise<Array<FreeStuffPost>>;
    getLikeCount(postId: PostId): Promise<bigint>;
    getUserProfile(user: UserId): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    likeFreeStuffPost(postId: bigint): Promise<void>;
    likePost(postId: PostId): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateAvatar(avatar: ExternalBlob): Promise<void>;
    updateFreeStuffAvailability(postId: bigint, isAvailable: boolean): Promise<void>;
    verifyFreeStuffPost(postId: bigint): Promise<void>;
}
