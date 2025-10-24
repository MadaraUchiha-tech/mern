import { FaUserCircle } from "react-icons/fa";
import { chatStore } from "../store/chatStore";
import { useEffect } from "react";
import { authStore } from "../store/authStore";

const Sidebar = () => {
  const { users, getUsers, setSelectedUser } = chatStore();
  const { onlineUsers } = authStore();
  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return (
    <aside className="h-full w-20 lg:w-72 flex flex-col transition-all duration-200 bg-gradient-to-b from-base-200 to-base-100">
      <div className=" w-full p-5 bg-base-100/80 backdrop-blur-md shadow-xl">
        <div className="flex items-center gap-3">
          <FaUserCircle className="size-7 text-primary" />
          <span className="font-semibold text-lg hidden lg:block tracking-wide text-primary">
            Contacts
          </span>
        </div>
      </div>
      <div className="overflow-y-auto w-full py-4 px-2 flex-1">
        {users.length === 0 && (
          <div className="text-center text-base-content/60 py-10">
            No contacts found.
          </div>
        )}
        {users.map((user) => (
          <button
            key={user._id}
            className="w-full flex items-center gap-4 p-2 my-2 rounded-xl hover:bg-primary/10 transition-colors bg-base-100 shadow-lg group"
            onClick={() => setSelectedUser(user)}
          >
            <div className="relative flex-shrink-0">
              <img
                src={user.profilepic}
                alt="profile"
                className="size-12 object-cover rounded-full group-hover:border-primary/60 transition-all"
              />
              {onlineUsers.includes(user._id) && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full shadow"></span>
              )}
            </div>
            <div className="hidden lg:flex flex-col items-start flex-1 min-w-0">
              <span className="font-medium text-base-content truncate">
                {user.username}
              </span>
              <span className="text-xs text-base-content/60 truncate">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </span>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
