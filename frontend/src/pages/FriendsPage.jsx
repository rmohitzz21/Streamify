import { useEffect, useState } from "react";
import FriendCard from "../components/FriendCard";
import { getUserFriends } from "../lib/api";

export default function FriendsPage() {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserFriends()
      .then(friends => setFriends(Array.isArray(friends) ? friends : []))
      .catch(() => setFriends([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-4xl space-y-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">
          Friends
        </h1>
        {loading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : !friends.length ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh]">
            <h2 className="text-xl font-semibold mb-2">No Friends Found</h2>
            <p className="text-gray-500">Start connecting with others to see your friends here!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {friends.map(friend => (
              <FriendCard key={friend._id} friend={friend} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
