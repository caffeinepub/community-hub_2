import Runtime "mo:core/Runtime";
import Map "mo:core/Map";
import List "mo:core/List";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import Int "mo:core/Int";
import Blob "mo:core/Blob";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Migration "migration";

import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";

// Specify migration function to run on every upgrade
(with migration = Migration.run)
actor {
  include MixinStorage();

  type UserId = Principal;
  type PostId = Nat;
  type CommentId = Nat;

  public type UserProfile = {
    username : Text;
    bio : Text;
    avatar : ?Storage.ExternalBlob;
  };

  public type Post = {
    id : PostId;
    author : UserId;
    content : Text;
    timestamp : Time.Time;
    likeCount : Nat;
  };

  public type Comment = {
    id : CommentId;
    postId : PostId;
    author : UserId;
    content : Text;
    timestamp : Time.Time;
  };

  module Post {
    public func compare(a : Post, b : Post) : Order.Order {
      Int.compare(b.timestamp, a.timestamp); // Descending order
    };
  };

  public type FreeStuffCategory = {
    #promoCode;
    #freeUGC;
    #freeGamePass;
    #tipsAndTricks;
    #general;
  };

  public type FreeStuffPost = {
    id : Nat;
    author : Principal;
    title : Text;
    description : Text;
    category : FreeStuffCategory;
    timestamp : Time.Time;
    contentType : Text;
    content : Text;
    tags : [Text];
    expirationTime : ?Time.Time;
    verified : Bool;
    likes : Nat;
    views : Nat;
    link : ?Text;
    proof : ?Text;
    isAvailable : Bool; // represents whether the item is still available
  };

  var nextPostId = 0;
  var nextCommentId = 0;
  var nextFreeStuffPostId = 0;

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let userProfiles = Map.empty<UserId, UserProfile>();
  let posts = Map.empty<PostId, Post>();
  let postLikes = Map.empty<PostId, List.List<UserId>>();
  let comments = Map.empty<PostId, List.List<Comment>>();
  let freeStuffPosts = Map.empty<Nat, FreeStuffPost>();

  // Required by frontend: get caller's own profile
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can view their profile");
    };
    userProfiles.get(caller);
  };

  // Required by frontend: save caller's own profile
  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Required by frontend: get any user's profile (public)
  public query ({ caller }) func getUserProfile(user : UserId) : async ?UserProfile {
    userProfiles.get(user);
  };

  public shared ({ caller }) func createOrUpdateProfile(username : Text, bio : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can update profiles");
    };

    let existingAvatar = switch (userProfiles.get(caller)) {
      case (null) { null };
      case (?profile) { profile.avatar };
    };

    let profile : UserProfile = {
      username;
      bio;
      avatar = existingAvatar;
    };

    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func updateAvatar(avatar : Storage.ExternalBlob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can update avatars");
    };

    let existingProfile = switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("Profile does not exist") };
      case (?profile) { profile };
    };

    let updatedProfile : UserProfile = {
      username = existingProfile.username;
      bio = existingProfile.bio;
      avatar = ?avatar;
    };

    userProfiles.add(caller, updatedProfile);
  };

  public shared ({ caller }) func createPost(content : Text) : async PostId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can create posts");
    };

    let postId = nextPostId;
    nextPostId += 1;

    let post : Post = {
      id = postId;
      author = caller;
      content;
      timestamp = Time.now();
      likeCount = 0;
    };

    posts.add(postId, post);
    postId;
  };

  // Public feed - no auth required
  public query func getAllPosts() : async [Post] {
    let postArray = posts.values().toArray();
    postArray.sort(func(a : Post, b : Post) : Order.Order {
      Int.compare(b.timestamp, a.timestamp);
    });
  };

  public shared ({ caller }) func likePost(postId : PostId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can like posts");
    };

    switch (posts.get(postId)) {
      case (null) { Runtime.trap("Post does not exist") };
      case (?_post) {
        let currentLikes = switch (postLikes.get(postId)) {
          case (null) { List.empty<UserId>() };
          case (?likes) { likes };
        };

        let hasAlreadyLiked = currentLikes.any(func(userId : UserId) : Bool { userId == caller });
        if (hasAlreadyLiked) { Runtime.trap("User has already liked this post") };

        currentLikes.add(caller);
        postLikes.add(postId, currentLikes);

        updateLikeCount(postId, currentLikes.size());
      };
    };
  };

  func updateLikeCount(postId : PostId, likeCount : Nat) {
    switch (posts.get(postId)) {
      case (null) {};
      case (?post) {
        let updatedPost = {
          post with
          likeCount
        };
        posts.add(postId, updatedPost);
      };
    };
  };

  // Public - no auth required to view like counts
  public query func getLikeCount(postId : PostId) : async Nat {
    switch (posts.get(postId)) {
      case (null) { Runtime.trap("Post does not exist") };
      case (?post) { post.likeCount };
    };
  };

  public shared ({ caller }) func addComment(postId : PostId, content : Text) : async CommentId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can comment");
    };

    let commentId = nextCommentId;
    nextCommentId += 1;

    let comment : Comment = {
      id = commentId;
      postId;
      author = caller;
      content;
      timestamp = Time.now();
    };

    let currentComments = switch (comments.get(postId)) {
      case (null) { List.empty<Comment>() };
      case (?c) { c };
    };
    currentComments.add(comment);
    comments.add(postId, currentComments);

    commentId;
  };

  // Public - no auth required to read comments
  public query func getComments(postId : PostId) : async [Comment] {
    switch (comments.get(postId)) {
      case (null) { [] };
      case (?commentList) { commentList.toArray() };
    };
  };

  // Free Stuff Feature

  public shared ({ caller }) func createFreeStuffPost(
    title : Text,
    description : Text,
    category : FreeStuffCategory,
    contentType : Text,
    content : Text,
    tags : [Text],
    expirationTime : ?Time.Time,
    link : ?Text,
    proof : ?Text,
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can create free stuff posts");
    };

    let postId = nextFreeStuffPostId;
    nextFreeStuffPostId += 1;

    let freeStuffPost : FreeStuffPost = {
      id = postId;
      author = caller;
      title;
      description;
      category;
      timestamp = Time.now();
      contentType;
      content;
      tags;
      expirationTime;
      verified = false;
      likes = 0;
      views = 0;
      link;
      proof;
      isAvailable = true; // default to true when posting
    };

    freeStuffPosts.add(postId, freeStuffPost);
    postId;
  };

  // Public browsing - no auth required
  public query func getFreeStuffPosts(
    category : ?FreeStuffCategory,
    tag : ?Text,
    sortBy : ?Text,
  ) : async [FreeStuffPost] {
    let allPosts = freeStuffPosts.values().toArray();

    let filteredPosts = allPosts.filter(
      func(post : FreeStuffPost) : Bool {
        switch (category, tag) {
          case (null, null) { true };
          case (?cat, null) { post.category == cat };
          case (null, ?t) {
            post.tags.find(func(tag : Text) : Bool { tag == t }) != null
          };
          case (?cat, ?t) {
            post.category == cat and post.tags.find(func(tag : Text) : Bool { tag == t }) != null
          };
        };
      }
    );

    switch (sortBy) {
      case (? "likes") {
        filteredPosts.sort(func(a : FreeStuffPost, b : FreeStuffPost) : Order.Order {
          Int.compare(b.likes, a.likes)
        });
      };
      case (_) {
        filteredPosts.sort(func(a : FreeStuffPost, b : FreeStuffPost) : Order.Order {
          Int.compare(b.timestamp, a.timestamp)
        });
      };
    };
  };

  public shared ({ caller }) func likeFreeStuffPost(postId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can like posts");
    };

    switch (freeStuffPosts.get(postId)) {
      case (null) { Runtime.trap("FreeStuffPost does not exist") };
      case (?post) {
        let updatedPost = {
          post with
          likes = post.likes + 1
        };
        freeStuffPosts.add(postId, updatedPost);
      };
    };
  };

  // Admin-only: verify a free stuff post
  public shared ({ caller }) func verifyFreeStuffPost(postId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can verify posts");
    };

    switch (freeStuffPosts.get(postId)) {
      case (null) { Runtime.trap("FreeStuffPost does not exist") };
      case (?post) {
        let updatedPost = {
          post with
          verified = true
        };
        freeStuffPosts.add(postId, updatedPost);
      };
    };
  };

  // Allows post creators or admins to update availability status
  // Requires at minimum a registered user; guests are not permitted
  public shared ({ caller }) func updateFreeStuffAvailability(postId : Nat, isAvailable : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can update availability status");
    };

    switch (freeStuffPosts.get(postId)) {
      case (null) { Runtime.trap("FreeStuffPost does not exist") };
      case (?post) {
        if (post.author != caller and not (AccessControl.isAdmin(accessControlState, caller))) {
          Runtime.trap("Unauthorized: Only post creator or admins can update availability status");
        };
        let updatedPost = {
          post with
          isAvailable;
        };
        freeStuffPosts.add(postId, updatedPost);
      };
    };
  };

  // Admin-only: delete a free stuff post
  public shared ({ caller }) func deleteFreeStuffPost(postId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete posts");
    };

    switch (freeStuffPosts.get(postId)) {
      case (null) { Runtime.trap("FreeStuffPost does not exist") };
      case (?_) {
        freeStuffPosts.remove(postId);
      };
    };
  };

  // Admin-only: delete a community post
  public shared ({ caller }) func deletePost(postId : PostId) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete posts");
    };

    switch (posts.get(postId)) {
      case (null) { Runtime.trap("Post does not exist") };
      case (?_) {
        posts.remove(postId);
      };
    };
  };
};
