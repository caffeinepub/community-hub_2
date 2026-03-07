import Map "mo:core/Map";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Text "mo:core/Text";

module {
  type FreeStuffCategory = {
    #promoCode;
    #freeUGC;
    #freeGamePass;
    #tipsAndTricks;
    #general;
  };

  type OldFreeStuffPost = {
    id : Nat;
    author : Principal.Principal;
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
  };

  type OldActor = {
    freeStuffPosts : Map.Map<Nat, OldFreeStuffPost>;
  };

  type NewFreeStuffPost = {
    id : Nat;
    author : Principal.Principal;
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
    isAvailable : Bool;
  };

  type NewActor = {
    freeStuffPosts : Map.Map<Nat, NewFreeStuffPost>;
  };

  public func run(old : OldActor) : NewActor {
    let newFreeStuffPosts = old.freeStuffPosts.map<Nat, OldFreeStuffPost, NewFreeStuffPost>(
      func(_id, oldPost) {
        { oldPost with isAvailable = true };
      }
    );
    { freeStuffPosts = newFreeStuffPosts };
  };
};
