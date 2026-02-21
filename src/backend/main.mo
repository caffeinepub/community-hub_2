import Runtime "mo:core/Runtime";
import Map "mo:core/Map";
import List "mo:core/List";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import Int "mo:core/Int";
import Blob "mo:core/Blob";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Iter "mo:core/Iter";

import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";

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

  var nextPostId = 0;
  var nextCommentId = 0;

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let userProfiles = Map.empty<UserId, UserProfile>();
  let posts = Map.empty<PostId, Post>();
  let postLikes = Map.empty<PostId, List.List<UserId>>();
  let comments = Map.empty<PostId, List.List<Comment>>();

  public shared ({ caller }) func createOrUpdateProfile(username : Text, bio : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can update profiles");
    };

    let profile : UserProfile = {
      username;
      bio;
      avatar = null;
    };

    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : UserId) : async ?UserProfile {
    userProfiles.get(user);
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

  public query ({ caller }) func getAllPosts() : async [Post] {
    let postArray = posts.values().toArray();
    postArray.sort();
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

        let hasAlreadyLiked = currentLikes.any(func(userId) { userId == caller });
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

  public query ({ caller }) func getLikeCount(postId : PostId) : async Nat {
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
      case (?comments) { comments };
    };
    currentComments.add(comment);
    comments.add(postId, currentComments);

    commentId;
  };

  public query ({ caller }) func getComments(postId : PostId) : async [Comment] {
    switch (comments.get(postId)) {
      case (null) { [] };
      case (?commentList) { commentList.toArray() };
    };
  };
};
